"use strict";

global.Promise = require("bluebird");
// Enable long stack traces
Promise.config({
  longStackTraces: true
});

// By default, promises fail silently if you don't attach a .catch() handler to them.
//This tool keeps track of unhandled rejections globally. If any remain unhandled at the end of your process, it logs them to STDERR and exits with code 1.
const hardRejection = require("hard-rejection");
// Install the unhandledRejection listeners
hardRejection();

const promisify = require("util").promisify;
const path = require("path");
const fs = require("fs-extra");
const cli = require("cli-color");
const _ = require("lodash");
const normalizeUserAgent = require("../../lib/index").normalizeUserAgent;
const TestJob = require("./test-job");
const Tunnel = require("browserstack-local").Local;

// Grab all the browsers from BrowserStack which are officially supported by the polyfil service.
const TOML = require("@iarna/toml");
const browserlist = TOML.parse(
  fs.readFileSync(path.join(__dirname, "./browsers.toml"), "utf-8")
).browsers;

const browserstacklist = TOML.parse(
  fs.readFileSync(path.join(__dirname, "./browserstackBrowsers.toml"), "utf-8")
).browsers;

const browsers = browserlist.filter(uaString => {
  if (uaString.startsWith('ios/')) {
    uaString = uaString.replace('ios', 'ios_saf');
  }
  return normalizeUserAgent(uaString) !== "other/0.0.0";
});

console.log({ browsers });

const useragentToBrowserObj = browserWithVersion => {
  const [browser, version] = browserWithVersion.split("/");
  for (const browserObject of browserstacklist) {
    if (browser === browserObject.os && version === browserObject.os_version) {
      return {
        deviceName: browserObject.device,
        platformName: browserObject.os,
        platformVersion: browserObject.os_version,
        real_mobile: true,
        'browserstack.appium_version': '1.9.1'
      };
    } else if (
      browser === browserObject.browser &&
      version === browserObject.browser_version
    ) {
      const o = {
        browserName: browserObject.browser,
        browserVersion: browserObject.browser_version, 
      };
      if (o.browserName === 'edge') {
        o["browserstack.selenium_version"] = "3.5.2";
      }
      return o;
    }
  }
  throw new Error(
    `Browser: ${browser} with version ${version} was not found on BrowserStack.`
  );
};

const testResultsFile = path.join(__dirname, "results.json");
const testResults = {};
const pollTick = 3000;
const testBrowserTimeout = 120000;
const mode =
  ["all", "control", "targeted"].filter(x => process.argv.includes(x))[0] || "all";

const director = process.argv.includes("director");
const always = "always=" + mode === "all" ? "yes" : "no";
const includePolyfills = "includePolyfills=" +(mode === "all" ? "yes" : "no");
// https://www.browserstack.com/question/759
const url = `http://bs-local.com:9876/${director ? '' : 'test'}?${includePolyfills}&${always}`;
const tunnelId =
  "build:" +
  (process.env.CIRCLE_BUILD_NUM || process.env.NODE_ENV || "null") +
  "_" +
  new Date().toISOString();
const jobs = browsers.map(browser => {
  const capability = useragentToBrowserObj(browser);
  return new TestJob(
    browser,
    url,
    mode,
    capability,
    tunnelId,
    testBrowserTimeout,
    pollTick
  );
});
const tunnel = new Tunnel();

const openTunnel = promisify(tunnel.start.bind(tunnel));
const closeTunnel = promisify(tunnel.stop.bind(tunnel));
const printProgress = (function() {
  let previousPrint;
  return jobs => {
    const out = ["-".repeat(80)];
    let readyCount = 0;
    jobs.forEach(job => {
      let msg = "";
      switch (job.state) {
        case "complete": {
          if (job.results.failed) {
            msg = cli.red(
              `✘ ${job.results.total} tests, ${job.results.failed} failures`
            );
          } else {
            msg = cli.green(`✓ ${job.results.total} tests`);
          }
          msg += `  ${job.duration} seconds to complete`;
          break;
        }
        case "error": {
          msg = cli.red(`⚠️  ${job.results}`);
          break;
        }
        case "ready": {
          readyCount += 1;
          break;
        }
        case "running": {
          msg =
            job.results.runnerCompletedCount + "/" + job.results.runnerCount;
          if (job.results.failed) {
            msg += cli.red("  ✘ " + job.results.failed);
          }
          const timeWaiting = Math.floor(
            (Date.now() - job.lastUpdateTime) / 1000
          );
          if (timeWaiting > 5) {
            msg += cli.yellow("  🕒  " + timeWaiting + "s");
          }
          break;
        }
        default: {
          msg = job.state;
          const timeWaiting = Math.floor(
            (Date.now() - job.lastUpdateTime) / 1000
          );
          if (timeWaiting > 5) {
            msg += cli.yellow("  🕒  " + timeWaiting + "s");
          }
        }
      }
      if (msg) {
        out.push(
          ` • Browser: ${job.name.padEnd(
            " ",
            20
          )} Testing mode: ${job.mode.padEnd(" ", 8)} ${msg}`
        );
      }
    });
    if (readyCount) {
      out.push(" + " + readyCount + " job(s) queued");
    }
    const print = out.join("\n") + "\n";
    if (previousPrint !== print) {
      process.stdout.write(print);
    }
    previousPrint = print;
  };
}());

(async function() {
  try {
    await openTunnel({
      verbose: "true",
      force: "true",
      onlyAutomate: "true",
      forceLocal: "true"
    });
    const cliFeedbackTimer = setInterval(() => printProgress(jobs), pollTick);
    // Run jobs within concurrency limits
    await new Promise((resolve, reject) => {
      const results = [];
      let resolvedCount = 0;
      function pushJob() {
        const job = jobs[results.length];
        results.push(
          job
            .run()
            .then(job => {
              if (job.state === "complete") {
                const [family, version] = job.name.split("/");
                _.set(
                  testResults,
                  [family, version, job.mode],
                  job.getResultSummary()
                );
              }
              resolvedCount++;
              if (results.length < jobs.length) {
                pushJob();
              } else if (resolvedCount === jobs.length) {
                resolve();
              }
              return job;
            })
            .catch(e => {
              console.log(e.stack || e);
              reject(e);
            })
        );
      }
      const concurrency = 5;
      for (let i = 0; i < concurrency && i < jobs.length; i++) {
        pushJob();
      }
    });

    await fs.outputJSON(testResultsFile, testResults);

    clearTimeout(cliFeedbackTimer);

    printProgress(jobs);

    await closeTunnel();
    console.log("Tunnel closed");

    const totalFailureCount = jobs.reduce(
      (out, job) => out + (job.state === "complete" ? job.results.failed : 1),
      0
    );
    if (totalFailureCount) {
      console.log(cli.bold.white("\nFailures:"));
      jobs.forEach(job => {
        if (job.results && job.results.tests) {
          job.results.tests.forEach(test => {
            console.log(" - " + job.name + ":");
            console.log("    -> " + test.name);
            console.log(
              "       " +
                url.replace("http://bs-local.com:9876/", "http://bs-local.com:9876/test") +
                "&feature=" +
                test.failingSuite
            );
            console.log("       " + test.message);
          });
        } else if (job.state !== "complete") {
          console.log(
            " • " +
              job.name +
              " (" +
              job.mode +
              "): " +
              cli.red(job.results || "No results")
          );
        }
      });
      console.log("");
      throw new Error("Failures detected");
    }
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
    process.exit(1);
  }
}());
