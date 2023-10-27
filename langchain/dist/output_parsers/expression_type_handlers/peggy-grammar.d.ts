declare namespace _default {
    export { peg$SyntaxError as SyntaxError };
    export { peg$parse as parse };
}
export default _default;
declare class peg$SyntaxError extends Error {
    static buildMessage(expected: any, found: any): string;
    constructor(message: any, expected: any, found: any, location: any);
    expected: any;
    found: any;
    location: any;
    format(sources: any): string;
}
declare function peg$parse(input: any, options: any): any;
