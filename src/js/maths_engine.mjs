import formatCalculation from "./format_calculation.mjs";
import { patternStack } from "../utils/constants.js";

const DIGITS_PRESENT_REGEX_GREEDY = /\d+/g,
    BINARY_OP_REGEX_GREEDY = /[+\-x\/]/gi,
    UNARY_MATHS_OPERATOR_REGEX = /[sr]/i,
    UNARY_MATHS_NUMBER_REGEX = /-?[0-9]*\.?[0-9]*/,
    BINARY_MATHS_NUMBER_REGEX =
        /^-?[0-9]+\.?[0-9]*[+|\-|x|\/]{1}-?[0-9]+\.?[0-9]*[+|\-|x|\/]{1}$/,
    DOUBLE_DOT_CATCHER = /(\.{2})/g,
    INITIAL_SOLITARY_DOT_CATCHER = /^\.$/,
    INITIAL_SOLITARY_DOT_WITH_REPEATED_DOT_CATCHER = /^\.(?!.*\.+)/g,
    NUM1_CATCHER_WITH_LEADING_ZERO_REGEX =
        /^(-?(0|[1-9])*\.?\d*)(?:[xy\-+\/])(-?(?:0|[1-9])*\.?\d*)/g,
    NUM1_CATCHER = /^(-?\d*\.?\d*)(?:[xy\/\-+])(?:-?\d*\.?\d*)/g,
    NUM2_CATCHER = /^(?:-?\d*\.?\d*)(?:[xy\/\-+])(-?\d*\.?\d*)/g,
    OPERATOR_CATCHER = /^(?:-?\d*\.?\d*)([xy\/\-+])(?:-?\d*\.?\d*)/g,
    INITIAL_SINGLE_DOT_CATCHER = /^(?!\.\.)\.{1}/g,
    INITIAL_DOUBLE_DOT_CATCHER = /^(\.{2})/g,
    MULTI_DOUBLE_DOT_CATCHER = /(\.{2})/g,
    STANDALONE_NUM2_CATCHER =
        /^(-?(?:0|[1-9])*\.?\d*)([xy\-+\/])(-?(?:(?:0|[1-9])*\.?\d*))/g,
    // patternStack.INTEGER_MATH_CATCHER =
    //     /^(-?(?:0|[1-9])*\.?\d*)([s|r])$|^(-?(?:0|[1-9])*\.?\d*)([xy\-+\/])(-?(?:(?:0|[1-9])*\.?\d*))$/,
    // ^(-?(?:0|[1-9])*\.?\d*)([s|r])$|^((?!^\d\\+-$)-?(?:0|[1-9])*\.?\d*)(?!^[xy\-+\/]\d+$)(?:[xy\-+\/])(-?(?:(?:0|[1-9])*\.?\d*))$
    DOUBLE_HYPHEN_PRESENT_REGEX = /(\d+-{2}\d+)/g,
    DOUBLE_HYPHEN_AB_CAPTURE_REGEX = /-?\d+\.*\d*/g;

export const doMaths = (input) => {
    let result = {};
    result.value = input;
    console.log("input to test", input);
    console.log(input.match(patternStack.INTEGER_MATH_CATCHER));
    // return result;
    if (!patternStack.INTEGER_MATH_CATCHER.test(input)) {
        console.log("FAILED - NOT valid computational unit");
        // result.test1 = false;
        // return result;
    }
    // console.log("time for doing maths!", input);

    // result.value = patternStack.INTEGER_MATH_CATCHER.test(input)
    //     ? !input.match(patternStack.INTEGER_MATH_CATCHER)[3]
    //         ? // unary maths
    //           getMathOperation(
    //               input.match(patternStack.INTEGER_MATH_CATCHER)[2],
    //               input.match(patternStack.INTEGER_MATH_CATCHER)[1]
    //           )
    //         : // binary maths
    //           getMathOperation(
    //               input.match(patternStack.INTEGER_MATH_CATCHER)[4],
    //               input.match(patternStack.INTEGER_MATH_CATCHER)[3],
    //               input.match(patternStack.INTEGER_MATH_CATCHER)[5]
    //           )
    //     : null;
    // null;
    console.log(input.match(patternStack.INTEGER_MATH_CATCHER));
    result.value = patternStack.INTEGER_MATH_CATCHER.test(input)
        ? getMathOperation(
              input.match(patternStack.INTEGER_MATH_CATCHER)[2],
              input.match(patternStack.INTEGER_MATH_CATCHER)[1],
              input.match(patternStack.INTEGER_MATH_CATCHER)[3]
          )
        : null;

    if (result.value || result.value === 0) {
        console.log("and the result is ", +result.value);
        result.computed = true;
        return result;
    } else {
        console.log("maths failed", input);
        result.value = input;
        result = formatCalculation(input);
        result.computed = false;
        return result;
    }
};

const doMaths2 = (functionStack) => (operator, num1, num2) => {
    return operator === "s" || operator === "r"
        ? functionStack[operator](num1)
        : operator === "x" ||
          operator === "y" ||
          operator === "+" ||
          operator === "-" ||
          operator === "/"
        ? functionStack[operator](num1, num2)
        : undefined;
};

const mathFunctionStack = {
    // square root
    r: Math.sqrt,
    // square
    s: function (a) {
        return a ** 2;
    },
    //  multiply
    x: function (a, b) {
        return a * b;
    },
    //  x raised to y
    y: function (a, b) {
        return a ** b;
    },
    //  addition
    "+": function (a, b) {
        return +a + +b;
    },
    //  subtraction
    "-": function (a, b) {
        return +a - +b;
    },
    //  division
    "/": function (a, b) {
        return +a / +b;
    },
};

const getMathOperation = doMaths2(mathFunctionStack);

const testData = [
    // "9r",
    "9.r",
    // ".s",
    ".9s",
    "9.s",
    // "9y",
    // "9r6x",
    // "9.r9435x",
    // ".s9435x",
    // ".9s9435x",
    // "9.s9435x",
    // "9s9435x",
    "9x6",
    "-0.934x-8.435",
    // "9x6x",
    // "9+6x",
    // "9y3x",
    // "9-3x",
    // "-9.534/2x",
    // "9-2-",
    // "-9--2-",
    // "-9+2-",
    // "9+-2-",
    // "9--2-",
    // "9--5-",
    // "9+-9-",
    // "-9+-2-",
    // "-9--2-",
    // "94342.656--2x",
    // "94342.656----2x",
    // "------------",
    // "------3--",
    // ".",
    // "..",
    // "....9..",
    // "..9....",
    // ".9.....",
    // ".9.....",
    // ".9.",
    // ".9..",
    // ". ",
    // " ",
    // "   ",
];
const dotTestData = [
    // "9r",
    // "9.r",
    // ".s",
    // ".9s",
    // "9.s",
    // "9y",
    // "9r6x",
    // "9.r9435x",
    // ".s9435x",
    // ".9s9435x",
    // "9.s9435x",
    // "9s9435x",
    // "9x6",
    // "9x6x",
    // "9+6x",
    // "9y3x",
    // "9-3x",
    // "-9.534/2x",
    // "9-2-",
    // "-9--2-",
    // "-9+2-",
    // "9+-2-",
    // "9--2-",
    // "9--5-",
    // "9+-9-",
    // "-9+-2-",
    // "-9--2-",
    // "94342.656--2x",
    // "94342.656----2x",
    // "------------",
    // "------3--",
    ".",
    "-.",
    // "..",
    // "......",
    ".9.",
    "..9.",
    ".9..",
    "....9.",
    "9....",
    // "-99898....",
    // "998.98....",
    // "..9....",
    // ".9.....",
    // ".9.....",
    // ".9..",
    // ". ",
    // " ",
    // "   ",
];
const num1TestData = [
    ".",
    "-.",
    ".9",
    "-.9",
    "0.9-",
    ".5435",
    ".0005435",
    "-.00034345",
    "-.34345",
    "0.9-",

    // "5r",
    // "-5s",
    "5.x",
    "-5.",
    // "5552343",
    // "-342656054",
    // "000",
    // "-00000",
];
const repZeroTestData = [
    "0000",
    "0",
    "000000",
    "-000000",
    "-0",
    "-0.",
    "-.0000000",
    "0.000",
];
const universalDoubleDotTestData = [
    ".34234x.34234.",
    ".34234.x.34234",
    "-.34234--.34234.",
    ".34234.x-.34234",
    "..x.",
    ".y..",
    "-../-.",
    ".34234.",
    "..",
    ".x.",
    "9.3.",
    "9.3423424.",
    "-.34234.",
    "-..",
    "-.x.",
    "-9.3.",
    "-9.3423424.",
];

const runTests = (data, pattern) => {
    console.log("test", data);
    for (let d of data) {
        console.log("====================================");
        // console.log("test", d, pattern.test(d));
        // console.log("exec", pattern.exec(d));
        // console.log("match", d, d.match(pattern));
        doMaths(d);
    }
};

// runTests(testData, DOUBLE_HYPHEN_AB_CAPTURE_REGEX);
// runTests(testData);
// runTests(num1TestData);
// runTests(repZeroTestData);

export default doMaths;
