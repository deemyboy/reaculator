export const APPLICATION_TITLE = "Reaculator";
export const CANVAS_CONTAINER_ID = "cvs";
export const BINARY_OPERATOR_REGEX = /[xy\/\-+=]/i;
export const UNARY_OPERATOR_REGEX = /[sr]/;
export const NUMBER_REGEX = /\d/;
export const CONTINUING_MATH_OPERATOR_CATCHER = /[xy\/\-+rs]/;
export const VALID_COMPUTATION =
  /(^-?\d+\.?\d*)([xy\/\-+])(-?\d+\.?\d*)([xy\/\-+=]$)|^(-?\d*\.?\d*)([rs=])$/;
export const UNICHAR_REPLACEMENT_CATCHER = /[x\/sry]/;
export const LAST_OPERATOR_CATCHER =
  /(?:-?\d+\.?\d*)(?:[xy\/\-+])(?:-?\d+\.?\d*)([xy\/\-+=])/;

export const patternStack = {
  INITIAL_OPERATOR_CATCHER: /^[xy\/\-+=rsacm]$/,
  NUM1_EQUALS_CATCHER: /^-?\d+\.?\d*?(=)$/,
  NUM1_OPERATOR_THEN_EQUALS_CATCHER: /^-?\d+\.?\d*?[+\-x\/y](=)$/,
  NUM1_INVISIBLE_ZERO_CATCHER: /(^-?\.\d*)/,
  NUM1_INVISIBLE_ZERO_WITH_OPERATOR_CATCHER: /^-?0{1,}.\d+[xy\/\-+rs]/,
  NUM2_INVISIBLE_ZERO_CATCHER: /([xy\/\-+])0{2,}/,
  NUM1_TRAILING_DECIMAL_ZERO_CATCHER:
    /^-?(0+[1-9]+[xy\/\-+rs])|^-?\d+\.(0+)[xy\/\-+rs]/,
  NUM2_REPEATED_INITIAL_ZERO_CATCHER: /.*[xy\/\-+]-?0{2,}$/,
  NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER:
    /(.*)([xy\/\-+])(-?0{1,}\.0+)([xy\/\-+])$/,
  NUM2_UNARY_OPERATOR_CATCHER: /^-?\d+\.?\d*[xy\/\-+]-?\d+\.?\d*(s|r)$/,
  NUM1_REPEATED_ZERO_CATCHER: /^-?0{1,}\d$/,
  UNIVERSAL_EXTRA_DOT_CATCHER: /\d+\.\d+\./,
  UNIVERSAL_DOUBLE_DOT_CATCHER: /\.\./,
  UNNARY_MATH_CATCHER: /^(-?\d*\.?\d*)([rs=])$/,
  MATH_CATCHER:
    /^(-?\d+\.?\d*)([rs])$|^(-?\d+\.?\d*)([xy\/\-+])(-?\d+\.?\d*)([xy\/\-+=])$/,
  DOUBLE_OPERATOR_CATCHER:
    /^(-?\d+\.?\d*)([xy\/\-+rs]{2})$|-?\d+\.?\d*[xy\/\+\-]{2}$/,
  NUM1_FLOATING_DOT_CATCHER:
    /(?!^-?\d+\.\d+)^-?(\d+\.[xy\/\-+rs=])|-?\d*\.(r|s|=)/,
  NUM2_FLOATING_DOT_CATCHER: /(?!^-?\d+\.\d+)[xy\/\-+](-?\d+\.[xy\/\-+])$/,
  PLUS_MINUS_CATCHER: /^(-?\d+\.?\d*)m|(-?\d+\.?\d*)([xy\/\-+])(-?\d+\.?\d*)m$/,
  M_CATCHER: /([xy\/\-+=])m$/,
  C_CATCHER: /(.*)c$/,
  A_CATCHER: /(.*)a$/,
};
