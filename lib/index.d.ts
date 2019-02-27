import {FeatureList, PolyfillOptions} from "polyfill-library";
import {ReadStream} from "fs";

declare module "polyfill-library" {
  /**
   * this is the config found in /polyfills/polyfill-name/config.json
   */
  export type PolyfillConfig = {
    aliases: string[],
    browsers: Record<string, string>,
    spec: string,
    docs: string,

    license?: "Apache-2.0" | "CC0-1.0" | "ISC" | "MIT" | "WTFPL",
    notes?: string[],
    install?: {
      module?: string,
      postinstall?: string
    },
    detectSource?: string,
    hasTests?: boolean,
    isTestable?: boolean,
    isPublic?: boolean,
    size?: number,
  }

  export type FeatureList = {
    [featureName: string]: {
      flags?: string[] | Set<string>
    }
  }

  export type PolyfillOptions = {
    minify?: boolean,
    unknown?: "ignore" | "polyfill",
    features?: FeatureList,
    excludes?: string[],
    uaString?: string,
    rum?: boolean,
  };

  export function listAllPolyfills(): Promise<string[]>;

  export function describePolyfill(featureName: String): Promise<PolyfillConfig>;

  export function getOptions(opts: PolyfillOptions): PolyfillOptions;

  export function getPolyfills(opts: PolyfillOptions): Promise<FeatureList>;

  export function getPolyfillString(opts: PolyfillOptions & {stream: false}): Promise<string>;
  export function getPolyfillString(opts: PolyfillOptions): Promise<string>;
  export function getPolyfillString(opts: PolyfillOptions & {stream: true}): ReadStream;
  export function getPolyfillString(opts: PolyfillOptions & {stream?: boolean}): Promise<string> | ReadStream;
}
