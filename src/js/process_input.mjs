import { patternStack } from "./constants.js";
import { unicodify, deunicodify } from "./maths_engine.mjs";

export const processRawInput = (input) => {
    // console.log("processRawInput", input);
    for (const key in patternStack) {
        var _input = getPatternOperation(patternStack[key], key, input);
        if (_input || _input === "") {
            return _input;
        }
    }
    return input;
};

const processRawInput2 = (repairs) => (pattern, name, input) => {
    // console.log("processRawInput2 |", name);
    if (pattern.test(input)) {
        input = repairs[name](input);
        return input;
    }
};

const repairStack = {
    INITIAL_OPERATOR_CATCHER: function (input) {
        console.log(`INITIAL_OPERATOR_CATCHER ${input}`);
        input = "";
        return input;
    },
    NUM1_INVISIBLE_ZERO_CATCHER: function (input) {
        console.log(`NUM1_INVISIBLE_ZERO_CATCHER ${input}`);
        input = "0" + input;
        return input;
    },
    NUM2_INVISIBLE_ZERO_CATCHER: function (input) {
        console.log(`NUM2_INVISIBLE_ZERO_CATCHER ${input}`);
        let _value = input;
        let matches = patternStack.NUM2_INVISIBLE_ZERO_CATCHER.exec(_value);

        let idx = matches.indices[1][0];
        let _num1 = _value.substring(0, idx);
        let _num2 = _value.substring(idx + 1);
        let _operator = _value.substring(idx, idx + 1);
        _num2 = "0" + _num2;
        input = _num1 + _operator + _num2;
        return input;
    },
    NUM2_INVISIBLE_ZERO_OPERATOR_CATCHER: function (input) {
        console.log(`NUM2_INVISIBLE_ZERO_OPERATOR_CATCHER ${input}`);
        let _value = input;
        let matches =
            patternStack.NUM2_INVISIBLE_ZERO_OPERATOR_CATCHER.exec(_value);

        let idx = matches.indices[1][0];
        let _num1 = _value.substring(0, idx);
        let _num2 = _value.substring(idx + 1);
        let _operator = _value.substring(idx, idx + 1);
        _num2 = "0" + _num2;
        input = _num1 + _operator + _num2;
        return input;
    },
    NUM1_TRAILING_DECIMAL_ZERO_CATCHER: function (input) {
        console.log(`NUM1_TRAILING_DECIMAL_ZERO_CATCHER ${input}`);
        let _value = input;
        let matches = _value.match(
            patternStack.NUM1_TRAILING_DECIMAL_ZERO_CATCHER
        );
        if (matches) {
            if (matches.indices[2]) {
                let _operator = _value.charAt(_value.length - 1);
                _value = _value.replace(/.$/, "");
                _value = Number(_value).toString();
                input = _value + _operator;
            }
        }
        return input;
    },
    NUM2_REPEATED_INITIAL_ZERO_CATCHER: function (input) {
        console.log(`NUM2_REPEATED_INITIAL_ZERO_CATCHER ${input}`);
        let _value = input;
        let matches = _value.match(
            patternStack.NUM2_REPEATED_INITIAL_ZERO_CATCHER
        );
        if (matches) {
            _value = _value.replace(/.$/, "");
            input = _value;
        }

        return input;
    },
    NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER: function (input) {
        console.log(
            `NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER ${input}`
        );
        let matches = input.match(
            patternStack.NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER
        );
        // 0.00x <- float num2 + operator
        if (matches) {
            let _num1 = matches[1];
            let _op1 = matches[2];
            let _op2 = matches[4];
            input = _num1 + _op1 + "0" + _op2;
        }

        return input;
    },
    NUM1_REPEATED_ZERO_CATCHER: function (input) {
        console.log(`NUM1_REPEATED_ZERO_CATCHER ${input}`);
        input = Number(input).toString();
        return input;
    },

    UNIVERSAL_EXTRA_DOT_CATCHER: function (input) {
        // console.log(`UNIVERSAL_EXTRA_DOT_CATCHER ${input}`);
        input = input.substring(0, input.length - 1);
        return input;
    },
    UNIVERSAL_DOUBLE_DOT_CATCHER: function (input) {
        // console.log(`UNIVERSAL_DOUBLE_DOT_CATCHER ${input}`);
        input = input.substring(0, input.length - 1);
        return input;
    },
    NUM1_INTEGER_WITH_OPERATOR_CATCHER: function (input) {
        // console.log(`NUM1_INTEGER_WITH_OPERATOR_CATCHER ${input}`);
        input = input.substring(0, input.length - 1);
        return input;
    },
    UNNARY_MATH_CATCHER: function (input) {
        // console.log(`UNNARY_MATH_CATCHER ${input}`);
        return input;
    },
    BINARY_MATH_CATCHER: function (input) {
        // console.log(`BINARY_MATH_CATCHER ${input}`);
        return input;
    },
    MATH_CATCHER: function (input) {
        // console.log(`MATH_CATCHER ${input}`);
        return input;
    },
    DOUBLE_OPERATOR_CATCHER: function (input) {
        console.log(`DOUBLE_OPERATOR_CATCHER ${input}`);
        return (
            input.substring(0, input.length - 2) +
            input.charAt(input.length - 1)
        );
    },
    NUM1_FLOATING_DOT_CATCHER: function (input) {
        // console.log(`NUM1_FLOATING_DOT_CATCHER ${input}`);
        const re = /\./;

        input = input.replace(re, "");
        return input;
    },
    NUM2_FLOATING_DOT_CATCHER: function (input) {
        // console.log(`NUM2_FLOATING_DOT_CATCHER ${input}`);
        const re = /\./;

        input = input.replace(re, "");
        return input;
    },
    PLUS_MINUS_CATCHER: function (input) {
        // console.log(`PLUS_MINUS_CATCHER ${input}`);
        let _value = input;
        let matches = _value.match(patternStack.PLUS_MINUS_CATCHER);
        if (matches) {
            let _num = matches[1] ? matches[1] : matches[4];
            let _num1 = matches[2] ? matches[2] : "";
            let _op = matches[3] ? matches[3] : "";
            _num = (+_num * -1).toString();
            if (matches[1]) {
                _value = _num + _op;
            } else {
                _value = _num1 + _op + _num;
            }
            input = _value;
        }
        return input;
    },
    M_CATCHER: function (input) {
        // console.log(`M_CATCHER ${input}`);
        input = input.replace(/.$/, "");
        return input;
    },
    C_CATCHER: function (input) {
        console.log(`C_CATCHER ${input}`);
        if (patternStack.C_CATCHER.test(input)) {
            input = input.replace(/..$/, "");
        }
        return input;
    },
    A_CATCHER: function (input) {
        console.log(`A_CATCHER ${input}`);
        return "a";
    },
};

const getPatternOperation = processRawInput2(repairStack);

export default processRawInput;
