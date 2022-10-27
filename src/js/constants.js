export const DOT_REGEX_GREEDY = /\./g;
export const PURE_INTEGER_REGEX = /[0-9]*/;
// export const INTEGER_REGEX = /[0-9sr]*/;
export const UNARY_MATHS_REGEX = /[0-9]+\.?[0-9]*[s|r]{1}/;
export const ALL_DIGITS_REGEX = /[0-9]*/g;
export const FLOAT_REGEX_GREEDY = /[0-9\.]*/g;
export const DOT_REGEX_NON_GREEDY = /\./;
export const UTIL_OPERATOR_REGEX_GREEDY = /[acm]/gi;
export const MATH_OPERATOR_REGEX = /[+\-x\/ysr=]/gi;
export const BINARY_OPERATOR_REGEX = /[+\-x\/y]/i;
export const UNARY_OPERATOR_REGEX = /[sr]/;
export const ALLOWED_CHARS_GREEDY = /([^A-LN-QT-WZa-ln-qt-wz\s])*/g;
export const APPLICATION_TITLE = "Reaculator";
export const CANVAS_CONTAINER_ID = "cvs";

export const patternStack = {
    INITIAL_OPERATOR_CATCHER: /^[xy\/\-+=rsacm]$/,
    NUM1_INVISIBLE_ZERO_CATCHER: /(^-?\.\d*)/,
    // NUM2_INVISIBLE_ZERO_CATCHER: /(?!^-\.)[xy\/\-+](-?\.\d*$)/,
    NUM2_INVISIBLE_ZERO_CATCHER: /(?![xy\/\-+]\.\d*$)\d*([xy\/\-+])-?\.\d*$/d,
    // LEADING_ZERO_CATCHER: /(-?0+)\d+\.\d*|(-?0+)\d+/,
    NUM1_TRAILING_DECIMAL_ZERO_CATCHER:
        /^-?(0+[1-9]+[xy\/\-+rs])|^-?\d+\.(0+)[xy\/\-+rs]/d,
    NUM2_REPEATED_INITIAL_ZERO_CATCHER: /.*[xy\/\-+]-?0{2,}$/,
    // NUM2_ZERO_CATCHER:
    //     /([xy\/\-+])((-?0{2,})[1-9]+)$|(([xy\/\-+])(-?0{2,}))$|(?:-?\d+|\.)([xy\/\-+])(-?0{1,}[1-9]+\.\d+)$|[xy\/\-+](-?0{2,})\.\d+$/d,
    NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER:
        /(.*)([xy\/\-+])(-?0{1,}\.0+)([xy\/\-+])$/d,
    NUM1_REPEATED_ZERO_CATCHER: /^-?0{1,}\.?\d$/,
    UNIVERSAL_EXTRA_DOT_CATCHER: /\d+\.\d+\./,
    UNIVERSAL_DOUBLE_DOT_CATCHER: /\.\./,
    UNNARY_MATH_CATCHER: /^(-?\d*\.?\d*)([rs=])$/,
    MATH_CATCHER:
        /^(-?\d*\.?\d*)([rs=])$|^(-?\d*\.?\d*)([xy\/\-+])(-?\d*\.?\d*)([xy\/\-+=])$/,
    DOUBLE_OPERATOR_CATCHER:
        /(?!^-?\d*\.?\d*[xy\/+-]-)^(-?\d*\.?\d*)([xy\/\-+]{2})/,
    NUM1_FLOATING_DOT_CATCHER:
        /(?!^-?\d+\.\d+)^-?(\d+\.[xy\/\-+])|^(-?\d*\.)([rs=])$/,
    NUM2_FLOATING_DOT_CATCHER: /(?!^-?\d+\.\d+)[xy\/\-+](-?\d+\.[xy\/\-+])$/,
    VALID_NUMBER:
        /(^-?\d+\.?\d*)([xy\/\-+])(-?\d+\.?\d*)([xy\/\-+=]$)|^(-?\d*\.?\d*)([rs=])$/,
};
