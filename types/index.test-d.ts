import { expectType } from "tsd";
import {
	PolyfillMeta,
	Options,
	Feature,
	listAllPolyfills,
	describePolyfill,
	getOptions,
	getPolyfills,
	getPolyfillString
} from "./index";

expectType<Promise<string[]>>(listAllPolyfills());

expectType<Promise<PolyfillMeta | undefined>>(describePolyfill("fetch"));

expectType<Options>(getOptions());
expectType<Options>(
	getOptions({
		uaString: "Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; en-US)",
		minify: true,
		features: {
			es6: { flags: ["gated"] }
		}
	})
);

expectType<Promise<Feature>>(getPolyfills());
expectType<Promise<Feature>>(
	getPolyfills({
		uaString: "Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; en-US)",
		minify: true,
		features: {
			es6: { flags: ["gated"] }
		}
	})
);

expectType<Promise<string | NodeJS.ReadableStream>>(getPolyfillString());
expectType<Promise<string | NodeJS.ReadableStream>>(
	getPolyfillString({
		uaString: "Mozilla/5.0 (Windows; U; MSIE 7.0; Windows NT 6.0; en-US)",
		minify: true,
		features: {
			es6: { flags: ["gated"] }
		}
	})
);
