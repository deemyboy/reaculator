export default class regexParser {
    constructor(_pattern) {
        this.pattern = _pattern;
    }

    pregMatch(string) {
        return string.match(this.pattern);
    }

    pregTest(string) {
        return this.pattern.test(string);
    }

    pregExec(string) {
        return this.pattern.exec(string);
    }
}
