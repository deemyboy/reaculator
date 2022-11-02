import {
    patternStack,
    UNARY_OPERATOR_REGEX,
    BINARY_OPERATOR_REGEX,
    VALID_NUMBER,
} from "../js/constants.js";
import { functionKeys } from "./keys.js";

export const convertFromUnicodeToChar = (_input) => {
    let count = 0;
    [..._input].forEach((c) => {
        [...functionKeys].forEach((k) => {
            if (k.uniChar === c) {
                _input = _input.replace(_input.charAt(count), k.value);
            }
        });
        count++;
    });
    return _input;
};

export const tryMaths = (input, resultValue) => {
    const extractComputationParts = (_input) => {
        let matches = VALID_NUMBER.exec(_input);

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
    input = convertFromUnicodeToChar(input);

    // console.log("tryMaths _computationalUnit", _computationalUnit);
    // if (!patternStack.MATH_CATCHER.test(input)) {
    //     console.log("FAILED - NOT valid computational unit");
    //     let _failed = {};
    //     _failed.computed = false;
    //     return _failed;
    // }

    let _result = {},
        _computationalUnit = extractComputationParts(input);

    // console.log("time for doing maths!", input);

    _result.value = getMathOperation(
        _computationalUnit.op1,
        _computationalUnit.num1,
        _computationalUnit.num2
    );

    if (_result.value || _result.value === 0) {
        // console.log("and the result is ", +_result.value);
        _result.computed = true;
        if (UNARY_OPERATOR_REGEX.test(_computationalUnit.op1)) {
            if (!resultValue) {
                _result.operationType = "unaryPrimaryOperation";
            } else {
                _result.operationType = "unarySecondaryOperation";
            }
        }
        if (BINARY_OPERATOR_REGEX.test(_computationalUnit.op1)) {
            if (!resultValue) {
                _result.operationType = "binaryPrimaryOperation";
            } else {
                _result.operationType = "binarySecondaryOperation";
            }
        }
        _result.operator = input.match(/.$/g)[0];
    } else {
        _result.computed = false;
    }
    return _result;
};

const tryMaths2 = (functionStack) => (operator, num1, num2) => {
    // console.log(operator, num1, num2);
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
        return (+a) ** 2;
    },
    //  multiply
    x: function (a, b) {
        return +a * +b;
    },
    //  x raised to y
    y: function (a, b) {
        return (+a) ** +b;
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

const getMathOperation = tryMaths2(mathFunctionStack);

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
        tryMaths(d);
    }
};

// runTests(testData, DOUBLE_HYPHEN_AB_CAPTURE_REGEX);
// runTests(testData);
// runTests(num1TestData);
// runTests(repZeroTestData);

export default tryMaths;

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
