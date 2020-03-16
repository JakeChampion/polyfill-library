type Flag = 'gated' | 'always';


// TODO: consider making the following types unions of string literals, e.g. 'es5' | 'es6' | 'es7' for PolyfillAlias

/** A browser */
type Browser = string;

/** A polyfill alias */
type PolyfillAlias = string;

/** A non-alias polyfill */
type PurePolyfill = string;

/** A polyfill name */
type Polyfill = PurePolyfill | PolyfillAlias;

/** Options for each feature */
interface FeatureOptions {
  flags: Iterable<Flag>;
}

interface OutputFeatures extends FeatureOptions {
  flags: Set<Flag>;
  aliasOf: Set<Polyfill>;
}

declare namespace PolyfillLibrary {
  /** Description of a polyfill */
  interface PolyfillDescription {
    /** The aliases that use this polyfill */
    aliases: PolyfillAlias[];
    /** The polyfills this polyfill depends upon */
    dependencies: Polyfill[];
    /** The URL to the ECMAScript spec defining the requirements for this polyfill */
    spec: string;
    /** Which browsers and what versions need this polyfill */
    browsers: { [k in Browser]: string };
    /** The JavaScript code needed to detect if this feature already exists */
    detectSource: string;
    /** Whether this polyfill has tests */
    hasTests: boolean;
    /** Whether this polyfill is testable */
    isTestable: boolean;
    /** Whether this polyfill can be accessed publicly */
    isPublic: boolean;
    /** The size of the polyfill in bytes */
    size: number;
  }

  /** Options for `getPolyfills` */
  interface PolyfillOptions {
    /** The user-agent string to check each feature against */
    uaString: string;
    /** Which features should be returned if the user-agent does not support them natively */
    features: { [feature in Polyfill]: FeatureOptions };
    /** Which features should be excluded from the returned object */
    excludes?: PurePolyfill[];
    /** Whether to return the minified or raw implementation of the polyfill */
    minify?: boolean;
    /** Whether to return all or no polyfills if the user-agent is unknown or unsupported */
    unknown?: 'ignore' | 'polyfill';
    /** Whether to include a script that reports anonymous usage data in the polyfill bundle */
    rum?: boolean;
  }

  /** Options for `getPolyfillString` */
  interface PolyfillStringOptions extends PolyfillOptions {
    /** Whether to return a stream of the polyfill string or a promise resolving with the string */
    stream?: boolean;
  }

  /**
   * Get a list of all the aliases which exist within the collection of polyfill sources
   * @returns A promise which resolves with an object mapping all the aliases within the collection to the polyfills they include
   */
  function listAliases(): Promise<{ [k in PolyfillAlias]: PurePolyfill[] }>;

  /**
   * Gets a list of all the polyfills supported by the library
   * @returns A promise which resolves with an array of all the polyfills within the collection
   */
  function listAllPolyfills(): Promise<PurePolyfill[]>;

  /**
   * Gets the metadata for a specific polyfill within the collection of polyfill sources
   * @param polyfill The name of a polyfill whose metadata should be returned
   * @returns A promise which resolves with the metadata or with `undefined` if no metadata exists for the polyfill
   */
  function describePolyfill(polyfill: PurePolyfill): Promise<PolyfillDescription | void>;

  /**
   * Create an options object for use with `getPolyfills` or `getPolyfillString`
   * @param options The options for `getPolyfills` or `getPolyfillString`
   * @returns The `options` object merged with the default option values
   */
  function getOptions(options: PolyfillOptions): Required<PolyfillOptions>;

  /**
   * Gets the necessary polyfills for a given user-agent
   * @param options The options for the polyfill detection
   * @returns A promise which resolves with the polyfills needed given the input options
   */
  function getPolyfills(options: PolyfillOptions): Promise<{ [k in PurePolyfill]: OutputFeatures }>;

  /**
   * Gets the necessary polyfill script for a given user-agent
   * @param options The options for the polyfill detection
   * @returns A promise which resolves with the JavaScript polyfill script
   */
  function getPolyfillString(options: PolyfillStringOptions & {
    stream?: false
  }): Promise<string>;
  /**
   * Gets the necessary polyfill script for a given user-agent
   * @param options The options for the polyfill detection
   * @returns A promise which resolves with the JavaScript polyfill script
   */
  function getPolyfillString(options: PolyfillStringOptions & {
    stream: true
  }): NodeJS.ReadableStream;
}
export = PolyfillLibrary;