# Contributing to polyfill-library

♥ the polyfill-library and want to get involved?
Thanks! There are plenty of ways you can help!

Please take a moment to review this document in order to make the contribution
process easy and effective for everyone involved.

Following these guidelines helps to communicate that you respect the time of
the developers managing and developing this open source project. In return,
they should reciprocate that respect in addressing your issue or assessing
patches and features.

## Adding a new polyfill

This documentation will use the [`Element.prototype.nextElementSibling` polyfill as an example](https://github.com/Financial-Times/polyfill-library/tree/master/polyfills/Element/prototype/nextElementSibling).

If you run into any issues please ask us a question, we are happy to help.

### Folder structure

The name of your folder is based on the method structure, for example:

`Element.prototype.nextElementSibling` would be `polyfills/Element/prototype/nextElementSibling`.

This folder contains 4 files:

- [config.toml](#config-toml)
- [detect.js](#detect-js)
- [polyfill.js](#polyfill-js)
- [tests.js](#tests-js)

### config.toml

#### Aliases

An alias is another name for the polyfill that can be used when requesting a bundle.

For example, the alias `es5` is used to replicate an ECMAScript 5 environment.

```toml
aliases = [
    'es5'
]
```

#### Dependencies

List any web platform features that you use in your polyfill.

For example:

```toml
dependencies = [
    "Element",
    "Object.defineProperty"
]
```

#### Browser compatibility
List what browsers require the polyfill.

You can check the related Mozilla Developer Network (MDN) page for the compatibility, they also have their browser compatibility data on GitHub.

For example: [MDN nextElementSibling browser support](https://github.com/mdn/browser-compat-data/blob/master/api/NonDocumentTypeChildNode.json#L99-L149)

Browsers that can be listed:
- android
- bb
- chrome
- edge
- edge_mob
- firefox
- ios_chr
- ios_saf
- ie
- ie_mob
- opera
- op_mini
- safari
- firefox_mob
- samsung_mob

The browser list uses a form of semantic versioning to indicate which browser requires polyfilling.

If all versions of a browser require the polyfill you can use the wildcard asterisk (*):

```toml
[browsers]
android = "*"
```

For specific versions you can specify a number, for example if a polyfill is required in Internet Explorer 8 and below you can use "<9":

```toml
[browsers]
ie = "<9"
```

#### Additional information

You can use the:

- `spec` field for the feature's specification.
- `docs` field for useful information.
- `license` field for the license the code has been given.

For example:
```toml
license = "MIT"
spec = "https://dom.spec.whatwg.org/#dom-nondocumenttypechildnode-nextelementsibling"
docs = "https://developer.mozilla.org/en-US/docs/Web/API/NonDocumentTypeChildNode/nextElementSibling"
```

### detect.js

The detect.js file will be run to check if the feature is available to use in the browser.

This is sometimes called [feature detection](https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing/Feature_detection) and it allows the browser to [detect and defer to native implementations](https://www.w3.org/2001/tag/doc/polyfills/#detect-and-defer-to-native-implementations).

### polyfill.js

This polyfill.js file will be run to enable a browser to work without the native implementation of the feature.

If your polyfill requires other features to work [list them in the config file](#dependencies).

Make sure your polyfill [does not squat on proposed names in speculative polyfills](https://www.w3.org/2001/tag/doc/polyfills/#don-t-squat-on-proposed-names-in-speculative-polyfills).

### tests.js

You should refer to the feature's specification to see how the feature should work.

If there are [web platform tests, you should use them to help you](https://www.w3.org/2001/tag/doc/polyfills/#pass-web-platform-tests-if-they-exist).

## Submitting a Pull Request

Good pull requests, such as patches, improvements, and new features, are a fantastic help. They should remain focused in scope and avoid containing unrelated commits.

Please **ask first** if somebody else is already working on this or the core developers think your feature is in-scope. Generally always have a related issue with discussions for whatever you are including.

Please also provide a **test plan**, i.e. specify how you verified that your addition works.

**IMPORTANT**: By submitting a patch, you agree to allow the project
owners to license your work under the terms of the [MIT License](../LICENSE.md) and the [CLA](./contribution_licence_agreement.md).

---

_Many thanks to [create-react-app](https://github.com/facebook/create-react-app/blob/master/CONTRIBUTING.md) for the inspiration with this contributing guide_