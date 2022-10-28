import { patternStack } from "../js/constants.js";
export const formatCalculation = (inputData) => {
    console.log("formatCalculation", inputData);
    // let _formattedData = { ...inputData };
    let _formattedData;
    for (const key in patternStack) {
        _formattedData = undefined;
        _formattedData = getPatternOperation(
            patternStack[key],
            key,
            inputData,
            _formattedData
        );
    }

    return _formattedData;
};

const formatCalculation2 =
    (repairs) => (pattern, name, inputData, formattedData) => {
        console.log("formatCalculation2", name, inputData, formattedData);
        if (pattern.test(inputData.value) && !formattedData) {
            console.log("formatCalculation2 |", name, "inputData=", inputData);
            formattedData = repairs[name](inputData);
            return formattedData;
        } else {
            return inputData;
        }
    };

const repairStack = {
    INITIAL_OPERATOR_CATCHER: function (inputData) {
        console.log(`INITIAL_OPERATOR_CATCHER ${inputData.value}`);
        inputData.updateUserInput = true;
        inputData.value = "";
        return inputData;
    },
    NUM1_INVISIBLE_ZERO_CATCHER: function (inputData) {
        console.log(`NUM1_INVISIBLE_ZERO_CATCHER ${inputData.value}`);
        inputData.value = "0" + inputData.value;
        inputData.updateUserInput = true;
        return inputData;
    },
    NUM2_INVISIBLE_ZERO_CATCHER: function (inputData) {
        console.log(`NUM2_INVISIBLE_ZERO_CATCHER ${inputData.value}`);
        let _value = inputData.value;
        let matches = patternStack.NUM2_INVISIBLE_ZERO_CATCHER.exec(_value);

        let idx = matches.indices[1][0];
        let _num1 = _value.substring(0, idx);
        let _num2 = _value.substring(idx + 1);
        let _operator = _value.substring(idx, idx + 1);
        _num2 = "0" + _num2;
        inputData.value = _num1 + _operator + _num2;
        inputData.updateUserInput = true;
        return inputData;
    },
    NUM2_INVISIBLE_ZERO_OPERATOR_CATCHER: function (inputData) {
        console.log(`NUM2_INVISIBLE_ZERO_OPERATOR_CATCHER ${inputData.value}`);
        let _value = inputData.value;
        let matches =
            patternStack.NUM2_INVISIBLE_ZERO_OPERATOR_CATCHER.exec(_value);

        let idx = matches.indices[1][0];
        let _num1 = _value.substring(0, idx);
        let _num2 = _value.substring(idx + 1);
        let _operator = _value.substring(idx, idx + 1);
        _num2 = "0" + _num2;
        inputData.value = _num1 + _operator + _num2;
        inputData.updateUserInput = true;
        return inputData;
    },
    NUM1_TRAILING_DECIMAL_ZERO_CATCHER: function (inputData) {
        console.log(`NUM1_TRAILING_DECIMAL_ZERO_CATCHER ${inputData.value}`);
        let _value = inputData.value;
        let matches = _value.match(
            patternStack.NUM1_TRAILING_DECIMAL_ZERO_CATCHER
        );
        if (matches) {
            if (matches.indices[2]) {
                let _operator = _value.charAt(_value.length - 1);
                _value = _value.replace(/.$/, "");
                _value = Number(_value).toString();
                inputData.value = _value + _operator;
                inputData.updateUserInput = true;
            }
        }
        return inputData;
    },
    NUM2_REPEATED_INITIAL_ZERO_CATCHER: function (inputData) {
        console.log(`NUM2_REPEATED_INITIAL_ZERO_CATCHER ${inputData.value}`);
        let _value = inputData.value;
        let matches = _value.match(
            patternStack.NUM2_REPEATED_INITIAL_ZERO_CATCHER
        );
        if (matches) {
            _value = _value.replace(/.$/, "");
            inputData.value = _value;
            inputData.updateUserInput = true;
        }

        return inputData;
    },
    NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER: function (inputData) {
        console.log(
            `NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER ${inputData.value}`
        );
        let matches = inputData.value.match(
            patternStack.NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER
        );
        // 0.00x <- float num2 + operator
        if (matches) {
            let _num1 = matches[1];
            let _op1 = matches[2];
            let _op2 = matches[4];
            inputData.value = _num1 + _op1 + "0" + _op2;
            inputData.updateUserInput = true;
        }

        return inputData;
    },
    NUM1_REPEATED_ZERO_CATCHER: function (inputData) {
        console.log(`NUM1_REPEATED_ZERO_CATCHER ${inputData.value}`);
        inputData.value = +inputData.value.toString();
        inputData.updateUserInput = true;
        return inputData;
    },

    UNIVERSAL_EXTRA_DOT_CATCHER: function (inputData) {
        console.log(`UNIVERSAL_EXTRA_DOT_CATCHER ${inputData.value}`);
        inputData.value = inputData.value.substring(
            0,
            inputData.value.length - 1
        );
        inputData.updateUserInput = true;
        return inputData;
    },
    UNIVERSAL_DOUBLE_DOT_CATCHER: function (inputData) {
        console.log(`UNIVERSAL_DOUBLE_DOT_CATCHER ${inputData.value}`);
        inputData.value = inputData.value.substring(
            0,
            inputData.value.length - 1
        );
        inputData.updateUserInput = true;
        return inputData;
    },
    NUM1_INTEGER_WITH_OPERATOR_CATCHER: function (inputData) {
        console.log(`NUM1_INTEGER_WITH_OPERATOR_CATCHER ${inputData.value}`);
        inputData.value = inputData.value.substring(
            0,
            inputData.value.length - 1
        );
        inputData.updateUserInput = true;
        return inputData;
    },
    UNNARY_MATH_CATCHER: function (inputData) {
        console.log(`UNNARY_MATH_CATCHER ${inputData.value}`);
        return inputData;
    },
    BINARY_MATH_CATCHER: function (inputData) {
        console.log(`BINARY_MATH_CATCHER ${inputData.value}`);
        return inputData;
    },
    MATH_CATCHER: function (inputData) {
        console.log(`MATH_CATCHER ${inputData.value}`);
        return inputData;
    },
    DOUBLE_OPERATOR_CATCHER: function (inputData) {
        console.log(`DOUBLE_OPERATOR_CATCHER ${inputData.value}`);
        inputData.value = inputData.value.substring(
            0,
            inputData.value.length - 1
        );
        inputData.updateUserInput = true;
        return inputData;
    },
    NUM1_FLOATING_DOT_CATCHER: function (inputData) {
        console.log(`NUM1_FLOATING_DOT_CATCHER ${inputData.value}`);
        const re = /\./;

        inputData.value = inputData.value.replace(re, "");
        inputData.updateUserInput = true;
        return inputData;
    },
    NUM2_FLOATING_DOT_CATCHER: function (inputData) {
        console.log(`NUM2_FLOATING_DOT_CATCHER ${inputData.value}`);
        const re = /\./;

        inputData.value = inputData.value.replace(re, "");
        inputData.updateUserInput = true;
        return inputData;
    },
    VALID_NUMBER: function (inputData) {
        console.log(`VALID_NUMBER ${inputData.value}`);
        return inputData;
    },
    PLUS_MINUS_CATCHER: function (inputData) {
        console.log(`PLUS_MINUS_CATCHER ${inputData.value}`);
        let _value = inputData.value;
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
            inputData.value = _value;
            inputData.updateUserInput = true;
        }
        return inputData;
    },
    M_CATCHER: function (inputData) {
        console.log(`M_CATCHER ${inputData.value}`);
        return inputData;
    },
    C_CATCHER: function (inputData) {
        console.log(`C_CATCHER ${inputData.value}`);
        let _value = inputData.value;
        let matches = _value.match(patternStack.C_CATCHER);
        if (matches) {
            inputData.value = matches[1].replace(/.$/, "");
            inputData.updateUserInput = true;
        }
        return inputData;
    },
    A_CATCHER: function (inputData) {
        console.log(`A_CATCHER ${inputData.value}`);
        inputData.value = "";
        inputData.updateUserInput = true;
        return inputData;
    },
};

const pregReplaceOperators = (inputData) => {
    //
};

const getPatternOperation = formatCalculation2(repairStack);

export default formatCalculation;
