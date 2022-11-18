export const BINARY_OPERATOR_REGEX = /[xy\/\-+=]/i;
export const UNARY_OPERATOR_REGEX = /[sr]/;
export const APPLICATION_TITLE = "Reaculator";
export const CANVAS_CONTAINER_ID = "cvs";
export const CONTINUING_MATH_OPERATOR_CATCHER = /[xy\/\-+rs]/;
export const VALID_COMPUTATION =
    /(^-?\d+\.?\d*)([xy\/\-+])(-?\d+\.?\d*)([xy\/\-+=]$)|^(-?\d*\.?\d*)([rs=])$/;
export const UNICHAR_REPLACEMENT_CATCHER = /[x\/sry]/;
export const LAST_OPERATOR_CATCHER =
    /(?:-?\d+\.?\d*)(?:[xy\/\-+])(?:-?\d+\.?\d*)([xy\/\-+=])/gm;

export const patternStack = {
    INITIAL_OPERATOR_CATCHER: /^[xy\/\-+=rsacm]$/,
    NUM1_INVISIBLE_ZERO_CATCHER: /(^-?\.\d*)/,
    NUM2_INVISIBLE_ZERO_CATCHER: /(?![xy\/\-+]\.\d*$)\d*([xy\/\-+])-?\.\d*$/d,
    NUM1_TRAILING_DECIMAL_ZERO_CATCHER:
        /^-?(0+[1-9]+[xy\/\-+rs])|^-?\d+\.(0+)[xy\/\-+rs]/d,
    NUM2_REPEATED_INITIAL_ZERO_CATCHER: /.*[xy\/\-+]-?0{2,}$/,
    NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER:
        /(.*)([xy\/\-+])(-?0{1,}\.0+)([xy\/\-+])$/d,
    NUM1_REPEATED_ZERO_CATCHER: /^-?0{1,}\.?\d$/,
    UNIVERSAL_EXTRA_DOT_CATCHER: /\d+\.\d+\./,
    UNIVERSAL_DOUBLE_DOT_CATCHER: /\.\./,
    UNNARY_MATH_CATCHER: /^(-?\d*\.?\d*)([rs=])$/,
    MATH_CATCHER:
        /^(-?\d+\.?\d*)([rs=])$|^(-?\d+\.?\d*)([xy\/\-+])(-?\d+\.?\d*)([xy\/\-+=])$/,
    DOUBLE_OPERATOR_CATCHER:
        // /(?!^-?\d*\.?\d*[xy\/\-+]-)^(-?\d*\.?\d*)([xy\/\-+rs]{2})/,
        /^(?!\d+\.?\d*(?:s|r))^(-?\d+\.?\d*)([xy\/\-+rs]{2})|(?![xy\/\-+](-?\d+\.?\d*)(?:=|r|s))[xy\/\-+](-?\d+\.?\d*)([xy\/\-+=rs]){2}/,
    NUM1_FLOATING_DOT_CATCHER:
        /(?!^-?\d+\.\d+)^-?(\d+\.[xy\/\-+])|^(-?\d*\.)([rs=])$/,
    NUM2_FLOATING_DOT_CATCHER: /(?!^-?\d+\.\d+)[xy\/\-+](-?\d+\.[xy\/\-+])$/,
    PLUS_MINUS_CATCHER:
        /^(-?\d+|-?\d+\.\d+)m|(-?\d+|-?\d+\.\d+)([xy\/\-+])(-?\d+|-?\d+\.\d+)m$/,
    M_CATCHER: /([xy\/\-+=])m$/,
    C_CATCHER: /(.*)(?<!a)c$/,
    A_CATCHER: /(.*)a$/,
};
