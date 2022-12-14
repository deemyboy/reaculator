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
    // console.log("doMath", input);
    const extractComputationParts = (_input) => {
        let matches = VALID_COMPUTATION.exec(_input);

        let calculataionParameters = {
            num1: "",
            num2: "",
            op1: "",
            op2: "",
        };
        if (!matches) return {};
        if (matches) {
            if (matches[1]) {
                calculataionParameters.num1 = matches[1];
                calculataionParameters.op1 = matches[2];
                calculataionParameters.num2 = matches[3];
                calculataionParameters.op2 = matches[4];
            } else if (matches[6] !== "=") {
                calculataionParameters.num1 = matches[5];
                calculataionParameters.op1 = matches[6];
                calculataionParameters.num2 = undefined;
                calculataionParameters.op2 = undefined;
            }
        }
        return calculataionParameters;
    };

    let _result = {},
        _computationalUnit = extractComputationParts(input);

    // console.log("time for doing maths!", input);
    if (Object.keys(_computationalUnit).length > 0) {
        _result.value = getMathOperation(
            _computationalUnit.op1,
            _computationalUnit.num1,
            _computationalUnit.num2
        );
    }

    if (
        Object.keys(_result).length > 0 &&
        _result.value !== undefined &&
        (!isFinite(_result.value) || isNaN(_result.value))
    ) {
        _result.error = true;
        _result.value = "err";
        return _result;
    }

    if (
        Object.keys(_result).length > 0 &&
        (_result.value || _result.value === 0)
    ) {
        // console.log("and the result is ", +_result.value);
        _result.value = _result.value.toString();
        _result.computed = true;
        _result.num1 = _computationalUnit.num1;
        _result.op1 = _computationalUnit.op1;
        _result.num2 = _computationalUnit.num2;
        _result.op2 = _computationalUnit.op2;
    } else {
        _result.computed = false;
        return _result;
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
