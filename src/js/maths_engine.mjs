import { patternStack, VALID_COMPUTATION } from "../js/constants.js";
import { functionKeys } from "./keys.js";

export const deunicodify = (str) => {
    let count = 0;
    [...str].forEach((c) => {
        if (/\d|\./.test(c)) {
            count++;
            return;
        }
        [...functionKeys].forEach((k) => {
            if (k.calculationDisplayChar) {
                if (k.calculationDisplayChar === c) {
                    str = str.replace(str.charAt(count), k.value);
                }
            }
        });
        count++;
    });
    return str;
};

export const unicodify = (str) => {
    let count = 0;
    [...str].forEach((c) => {
        if (/\d|\./.test(c)) {
            count++;
            return;
        }
        [...functionKeys].forEach((k) => {
            if (k.calculationDisplayChar) {
                if (k.value === c) {
                    str = str.replace(
                        str.charAt(count),
                        k.calculationDisplayChar
                    );
                }
            }
        });
        count++;
    });
    return str;
};

export const doMath = (input) => {
    console.log("doMath", input);
    const extractComputationParts = (_input) => {
        let matches = VALID_COMPUTATION.exec(_input);

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
            } else if (matches[6] !== "=") {
                computationObject.num1 = matches[5];
                computationObject.op1 = matches[6];
                computationObject.num2 = undefined;
                computationObject.op2 = undefined;
            }
        }
        return computationObject;
    };

    let _result = {},
        _computationalUnit = extractComputationParts(input);

    // console.log("time for doing maths!", input);

    _result.rawInput = input;
    _result.value = getMathOperation(
        _computationalUnit.op1,
        _computationalUnit.num1,
        _computationalUnit.num2
    );
    if (_result.value) {
        _result.value = _result.value.toString();
    }

    if (
        _result &&
        Object.keys(_result).length !== 0 &&
        !isFinite(_result.value)
    ) {
        _result.error = true;
    }

    if (_result.value || _result.value === 0) {
        // console.log("and the result is ", +_result.value);
        _result.computed = true;
        _result.num1 = _computationalUnit.num1;
        _result.op1 = _computationalUnit.op1;
        _result.num2 = _computationalUnit.num2;
        _result.op2 = _computationalUnit.op2;
    } else {
        _result.computed = false;
    }
    return _result;
};

const doMath2 = (functionStack) => (operator, num1, num2) => {
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

const getMathOperation = doMath2(mathFunctionStack);

export default doMath;
