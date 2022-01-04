export declare class ConsoleLoggerConfig {
    static log: boolean;
    static warn: boolean;
    static error: boolean;
}
export declare const createConsoleLogger: (ns: any, autoParseJsonString?: boolean) => {
    (...args: any[]): any;
    warn(...args: any[]): any;
    error(...args: any[]): any;
    log: any;
};
