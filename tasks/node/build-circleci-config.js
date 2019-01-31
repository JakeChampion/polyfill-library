"use strict";

const path = require('path');
const fs = require('fs');
const yaml = require('yaml');
const globby = require('globby');
const _ = require('lodash');

const circleConfig = yaml.parse(fs.readFileSync(path.join(__dirname, './circleci-config.yml'), 'utf8'));

const polyfillsWhichHaveTests = globby.sync(['polyfills/**/tests.js', '!polyfills/__dist'], {
    transform: (entry) => entry.replace('polyfills/', '').replace('/tests.js', '').replace(/\//g, '.')
});

_.chunk(polyfillsWhichHaveTests, 10).map(polyfillsWhichHaveTests => {
    const testCommands = polyfillsWhichHaveTests.map(feature => {
        return {run:`node ./test/polyfills/test-individual-feature.js ${feature}`};
    });
    return {
        docker: [{
            image: 'circleci/node:10'
        }],
        steps: [
        'checkout',
        {
            run: 'npm ci'
        },
        ...testCommands
    ]};
}).forEach((job, index) => {
    const jobName = `test_${index}`;
    circleConfig.jobs[jobName] = job;
    circleConfig.workflows.test.jobs.push({
        [jobName]: {
            filters: {
                tags: {
                    ignore: "/^v.*/"
                },
                branches: {
                    ignore: "master"
                }
            },
            requires: ["check_circle_config", "lint_js", "unit_tests", ...Object.keys(circleConfig.jobs).filter(job => job.startsWith('test_') && job !== jobName)]
        }
    });
});
fs.writeFileSync(
    path.join(__dirname, '../../.circleci/config.yml'), 
    `
# Do not modify this file directly, it is built by ./tasks/node/build-circleci-config.js.
${yaml.stringify(circleConfig)}
`
);