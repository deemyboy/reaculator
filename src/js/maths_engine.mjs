import { patternStack } from "../js/constants.js";

export const doMaths = (input) => {
    const extractComputationParts = (input) => {
        let matches = patternStack.VALID_NUMBER.exec(input);

        let computationObject = {
            num1: "",
            num2: "",
            op1: "",
            op2: "",
        };
        if (matches) {
            if (matches[1]) {
                computationObject.num1 = matches[1];
                computationObject.op1 = matches[2];
                computationObject.num2 = matches[3];
                computationObject.op2 = matches[4];
            } else {
                computationObject.num1 = matches[5];
                computationObject.op1 = matches[6];
                computationObject.num2 = undefined;
                computationObject.op2 = undefined;
            }
        }
        return computationObject;
    };
    let result = {},
        // _computationalUnit = {
        //     num1: "",
        //     num2: "",
        //     op1: "",
        //     op2: "",
        // };
        _computationalUnit = extractComputationParts(input);

    console.log("doMaths _computationalUnit", _computationalUnit);
    console.log(input.match(patternStack.MATH_CATCHER), input);
    // return result;
    if (!patternStack.MATH_CATCHER.test(input)) {
        console.log("FAILED - NOT valid computational unit");
        result.computed = false;
        return result;
    }
    console.log("time for doing maths!", input);

    result.value =
        // unary maths
        //     getMathOperation(
        //     _computationalUnit.op1,
        //     _computationalUnit.num1
        // );
        getMathOperation(
            _computationalUnit.op1,
            _computationalUnit.num1,
            _computationalUnit.num2
        );

    if (result.value || result.value === 0) {
        console.log("and the result is ", +result.value);
        result.computed = true;
        return result;
    } else {
        // console.log("maths failed", computationalUnit);
        // result.value = computationalUnit;
        // result = input;
        result.computed = false;
        return result;
    }
};

const doMaths2 = (functionStack) => (operator, num1, num2) => {
    console.log(operator, num1, num2);
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

const computation_unit_test_data = [
    "0",
    "1",
    "123",
    "-0",
    "-1",
    "-123",
    "00",
    "01",
    "0123",
    "-00",
    "-01",
    "-0123",
    "0.0",
    "0.0001",
    "1.0",
    "123.0",
    "-0.0",
    "-1.0",
    "-123.0",
    "0.35",
    "1.35",
    "123.35",
    "-0.35",
    "-1.35",
    "-123.35",
    "0.034",
    "1.034",
    "123.034",
    "-0.034",
    "-1.034",
    "-123.034",
    "00.034",
    "01.034",
    "0123.034",
    "-00.034",
    "-01.034",
    "-0123.034",
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

// 0
// 1
// 123
// -0
// -1
// -123
// 00
// 01
// 0123
// -00
// -01
// -0123
// 0.0
// 0.0001
// 1.0
// 123.0
// -0.0
// -1.0
// -123.0
// 0.35
// 1.35
// 123.35
// -0.35
// -1.35
// -123.35
// 0.034
// 1.034
// 123.034
// -0.034
// -1.034
// -123.034
// 00.034
// 01.034
// 0123.034
// -00.034
// -01.034
// -0123.034
// ..
// .
// ...234...45.435..435.45...54353......5.5.55.5..5.5.55...
// 5.  . . .. .545. ..45.5..4  . . .r  .. .. .  . .  ..
// ..
// .5
// -.5x
// 5.x46
// 5.x-4.6
// -5.4x.
// -5.4x.6
// -5.4x4.6
// -5.4x-4.6
// -56.4--4.6
// -0.4--4.6
// -000.4--4.6
// -0.4x-4.6
// -000/-4.6
// -000.4/-4.6
// -0.4--4.6
// ​
// 5.7-
// 5.7s
// -
// +

// 0x0.0
// 1x1.0
// 123x123.0
// 0.0x0
// 1.0x1
// 123.0x123

// 0.0
// 1.0
// 123.0
// 0
// 1
// 123
