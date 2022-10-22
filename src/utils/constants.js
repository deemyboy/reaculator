export const DOT_REGEX_GREEDY = /\./g;
export const PURE_INTEGER_REGEX = /[0-9]*/;
// export const INTEGER_REGEX = /[0-9sr]*/;
export const UNARY_MATHS_REGEX = /[0-9]+\.?[0-9]*[s|r]{1}/;
export const ALL_DIGITS_REGEX = /[0-9]*/g;
export const FLOAT_REGEX_GREEDY = /[0-9\.]*/g;
export const DOT_REGEX_NON_GREEDY = /\./;
export const UTIL_OP_REGEX_GREEDY = /[acm]/gi;
export const MATH_OP_REGEX_NON_GREEDY = /[+\-x\/ysr=]/i;
export const BINARY_OP_REGEX_NON_GREEDY = /[+\-x\/y]/i;
export const UNARY_OP_REGEX = /[sr]/;
export const ALLOWED_CHARS_GREEDY = /([^A-LN-QT-WZa-ln-qt-wz\s])*/g;
export const APPLICATION_TITLE = "Reaculator";
export const CANVAS_CONTAINER_ID = "cvs";

export const patternStack = {
    NEG_INVISIBLE_ZERO_CATCHER: /(^-\.\d*$)/,
    UNIVERSAL_REPEATED_ZERO_CATCHER: /(^(?!^-$)-?0*$)/, ///^(-?(?!^0{2,}\d*$)(?:0|[1-9]+))$/gm
    UNIVERSAL_REPEATED_ZERO_CATCHER: /^(-?(?!^0{2,}\d*$)(?:0|[1-9]+))$/, ///^(-?(?!^0{2,}\d*$)(?:0|[1-9]+))$/gm
    INVISIBLE_ZERO_CATCHER: /^\.\d*$/,
    UNIVERSAL_DECIMAL_CATCHER: /(^-?0\.\d*$)/g,
    UNIVERSAL_DOUBLE_DOT_CATCHER:
        /(^-?\d*\.\d*\.$)|(^-?\d*\.\d*[xy\/\-+]-?\d*\.\d*\.$)|(^-?\d*\.\d*\.[xy\/\-+]-?\d*\.\d*)$/,
    NUM1_INTEGER_CATCHER: /(?!^-$)(?!^-?0\d+$)^-?[0-9]+$/,
    NUM1_INTEGER_WITH_OPERATOR_CATCHER:
        /(?!^-$)(?!^-?0\d+[xy\/\-+]+$)^-?[0-9]+[xy\/\-+]+$/,
    INTEGER_MATH_CATCHER:
        /(?!^-$)(?!^-?0\d+[xy\/\-+]$)^(-?[0-9])+([xy\/\-+])(?!-?0\d+[xy\/\-+])(-?[0-9])+([xy\/\-+])$/,
    LEADING_ZERO_CATCHER: /(^(?!^-$)-?0\d$)/,
};
