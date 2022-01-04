// todo: add globally configurable ns regex black/white list
export class ConsoleLoggerConfig {
	static log = true;
	static warn = true;
	static error = true;
}

// tiny namespaced console.log proxy with globaly configurable silence config
// prettier-ignore
export const createConsoleLogger = (ns, autoParseJsonString = false) => {
	ns = `[${ns}]`;
	const { log, warn, error } = ConsoleLoggerConfig;

	// OPINIONATED: string could be auto JSON.parsed (defensivelly)...
	const parse = (v) => {
		if (autoParseJsonString && typeof v === 'string') {
			try { v = JSON.parse(v); } catch (e) {}
		}
		return v;
	}

	const logger = (...args) => log && console.log.apply(null, [ns, ...args.map(parse)]);
	logger.warn = (...args) => warn && console.warn.apply(null, [ns, ...args.map(parse)]);
	logger.error = (...args) => error && console.error.apply(null, [ns, ...args.map(parse)]);
	logger.log = logger;

	return logger;
};
