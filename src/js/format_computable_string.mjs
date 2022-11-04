import { patternStack } from "./constants.js";
import { functionKeys } from "./keys.js";
import {
    convertFromUnicodeToChar,
    convertFromCharToUnicode,
} from "./maths_engine.mjs";

export const formatComputableString = (computationData) => {
    // console.log("formatComputableString", computationData);
    computationData.calculationValue = convertFromUnicodeToChar(
        computationData.calculationValue
    );
    let _formattedData;
    // if (computationData.computed) {
    //     // console.log("we just completed a math!", computationData);
    //     delete computationData.computed;
    //     // console.log(computationData.calculationValue.charAt(computationData.calculationValue.length - 1));
    // }

    // NOT computed simple formatting
    // console.log("NO result - simple formatting!", computationData);
    for (const key in patternStack) {
        _formattedData = undefined;
        _formattedData = getPatternOperation(
            patternStack[key],
            key,
            computationData,
            _formattedData
        );
    }
    if (_formattedData.calculationValue) {
        _formattedData.calculationValue = convertFromCharToUnicode(
            _formattedData.calculationValue
        );
    }

    return _formattedData;
};

const formatComputableString2 =
    (repairs) => (pattern, name, computationData, formattedData) => {
        // console.log("formatComputableString2", name, computationData, formattedData);
        if (pattern.test(computationData.calculationValue) && !formattedData) {
            console.log(
                "formatComputableString2 |",
                name,
                "computationData=",
                computationData
            );
            formattedData = repairs[name](computationData);
            return formattedData;
        } else {
            return computationData;
        }
    };

const repairStack = {
    INITIAL_OPERATOR_CATCHER: function (computationData) {
        // console.log(`INITIAL_OPERATOR_CATCHER ${computationData.calculationValue}`);
        computationData.updateUserInput = true;
        computationData.calculationValue = "";
        return computationData;
    },
    NUM1_INVISIBLE_ZERO_CATCHER: function (computationData) {
        // console.log(`NUM1_INVISIBLE_ZERO_CATCHER ${computationData.calculationValue}`);
        computationData.calculationValue =
            "0" + computationData.calculationValue;
        computationData.updateUserInput = true;
        return computationData;
    },
    NUM2_INVISIBLE_ZERO_CATCHER: function (computationData) {
        // console.log(`NUM2_INVISIBLE_ZERO_CATCHER ${computationData.calculationValue}`);
        let _value = computationData.calculationValue;
        let matches = patternStack.NUM2_INVISIBLE_ZERO_CATCHER.exec(_value);

        let idx = matches.indices[1][0];
        let _num1 = _value.substring(0, idx);
        let _num2 = _value.substring(idx + 1);
        let _operator = _value.substring(idx, idx + 1);
        _num2 = "0" + _num2;
        computationData.calculationValue = _num1 + _operator + _num2;
        computationData.updateUserInput = true;
        return computationData;
    },
    NUM2_INVISIBLE_ZERO_OPERATOR_CATCHER: function (computationData) {
        // console.log(`NUM2_INVISIBLE_ZERO_OPERATOR_CATCHER ${computationData.calculationValue}`);
        let _value = computationData.calculationValue;
        let matches =
            patternStack.NUM2_INVISIBLE_ZERO_OPERATOR_CATCHER.exec(_value);

        let idx = matches.indices[1][0];
        let _num1 = _value.substring(0, idx);
        let _num2 = _value.substring(idx + 1);
        let _operator = _value.substring(idx, idx + 1);
        _num2 = "0" + _num2;
        computationData.calculationValue = _num1 + _operator + _num2;
        computationData.updateUserInput = true;
        return computationData;
    },
    NUM1_TRAILING_DECIMAL_ZERO_CATCHER: function (computationData) {
        // console.log(`NUM1_TRAILING_DECIMAL_ZERO_CATCHER ${computationData.calculationValue}`);
        let _value = computationData.calculationValue;
        let matches = _value.match(
            patternStack.NUM1_TRAILING_DECIMAL_ZERO_CATCHER
        );
        if (matches) {
            if (matches.indices[2]) {
                let _operator = _value.charAt(_value.length - 1);
                _value = _value.replace(/.$/, "");
                _value = Number(_value).toString();
                computationData.calculationValue = _value + _operator;
                computationData.updateUserInput = true;
            }
        }
        return computationData;
    },
    NUM2_REPEATED_INITIAL_ZERO_CATCHER: function (computationData) {
        // console.log(`NUM2_REPEATED_INITIAL_ZERO_CATCHER ${computationData.calculationValue}`);
        let _value = computationData.calculationValue;
        let matches = _value.match(
            patternStack.NUM2_REPEATED_INITIAL_ZERO_CATCHER
        );
        if (matches) {
            _value = _value.replace(/.$/, "");
            computationData.calculationValue = _value;
            computationData.updateUserInput = true;
        }

        return computationData;
    },
    NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER: function (
        computationData
    ) {
        console.log(
            `NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER ${computationData.calculationValue}`
        );
        let matches = computationData.calculationValue.match(
            patternStack.NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER
        );
        // 0.00x <- float num2 + operator
        if (matches) {
            let _num1 = matches[1];
            let _op1 = matches[2];
            let _op2 = matches[4];
            computationData.calculationValue = _num1 + _op1 + "0" + _op2;
            computationData.updateUserInput = true;
        }

        return computationData;
    },
    NUM1_REPEATED_ZERO_CATCHER: function (computationData) {
        // console.log(`NUM1_REPEATED_ZERO_CATCHER ${computationData.calculationValue}`);
        computationData.calculationValue =
            +computationData.calculationValue.toString();
        computationData.updateUserInput = true;
        return computationData;
    },

    UNIVERSAL_EXTRA_DOT_CATCHER: function (computationData) {
        // console.log(`UNIVERSAL_EXTRA_DOT_CATCHER ${computationData.calculationValue}`);
        computationData.calculationValue =
            computationData.calculationValue.substring(
                0,
                computationData.calculationValue.length - 1
            );
        computationData.updateUserInput = true;
        return computationData;
    },
    UNIVERSAL_DOUBLE_DOT_CATCHER: function (computationData) {
        // console.log(`UNIVERSAL_DOUBLE_DOT_CATCHER ${computationData.calculationValue}`);
        computationData.calculationValue =
            computationData.calculationValue.substring(
                0,
                computationData.calculationValue.length - 1
            );
        computationData.updateUserInput = true;
        return computationData;
    },
    NUM1_INTEGER_WITH_OPERATOR_CATCHER: function (computationData) {
        // console.log(`NUM1_INTEGER_WITH_OPERATOR_CATCHER ${computationData.calculationValue}`);
        computationData.calculationValue =
            computationData.calculationValue.substring(
                0,
                computationData.calculationValue.length - 1
            );
        computationData.updateUserInput = true;
        return computationData;
    },
    UNNARY_MATH_CATCHER: function (computationData) {
        // console.log(`UNNARY_MATH_CATCHER ${computationData.calculationValue}`);
        return computationData;
    },
    BINARY_MATH_CATCHER: function (computationData) {
        // console.log(`BINARY_MATH_CATCHER ${computationData.calculationValue}`);
        return computationData;
    },
    MATH_CATCHER: function (computationData) {
        // console.log(`MATH_CATCHER ${computationData.calculationValue}`);
        return computationData;
    },
    DOUBLE_OPERATOR_CATCHER: function (computationData) {
        // console.log(`DOUBLE_OPERATOR_CATCHER ${computationData.calculationValue}`);
        computationData.calculationValue =
            computationData.calculationValue.substring(
                0,
                computationData.calculationValue.length - 1
            );
        computationData.updateUserInput = true;
        return computationData;
    },
    NUM1_FLOATING_DOT_CATCHER: function (computationData) {
        // console.log(`NUM1_FLOATING_DOT_CATCHER ${computationData.calculationValue}`);
        const re = /\./;

        computationData.calculationValue =
            computationData.calculationValue.replace(re, "");
        computationData.updateUserInput = true;
        return computationData;
    },
    NUM2_FLOATING_DOT_CATCHER: function (computationData) {
        // console.log(`NUM2_FLOATING_DOT_CATCHER ${computationData.calculationValue}`);
        const re = /\./;

        computationData.calculationValue =
            computationData.calculationValue.replace(re, "");
        computationData.updateUserInput = true;
        return computationData;
    },
    PLUS_MINUS_CATCHER: function (computationData) {
        // console.log(`PLUS_MINUS_CATCHER ${computationData.calculationValue}`);
        let _value = computationData.calculationValue;
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
            computationData.calculationValue = _value;
            computationData.updateUserInput = true;
        }
        return computationData;
    },
    M_CATCHER: function (computationData) {
        // console.log(`M_CATCHER ${computationData.calculationValue}`);
        computationData.calculationValue =
            computationData.calculationValue.replace(/.$/, "");
        return computationData;
    },
    C_CATCHER: function (computationData) {
        // console.log(`C_CATCHER ${computationData.calculationValue}`);
        let _value = computationData.calculationValue;
        let matches = _value.match(patternStack.C_CATCHER);
        if (matches) {
            computationData.calculationValue =
                computationData.calculationValue.replace(/.c$/, "");
            computationData.rawUserInput = computationData.rawUserInput.replace(
                /.c$/,
                ""
            );
            // computationData.updateUserInput = true;
        }
        return computationData;
    },
    A_CATCHER: function (computationData) {
        console.log(`A_CATCHER ${computationData.calculationValue}`);
        computationData = {
            calculationClassName: "calculation",
            calculationValue: undefined,
            resultClassName: "result",
            resultDefaultClass: "result",
            resultErrorClass: "result_err",
            resultValue: undefined,
            rawUserInput: undefined,
        };
        return computationData;
    },
    // UNICHAR_REPLACEMENT_CATCHER: function (computationData) {
    //     console.log(
    //         `UNICHAR_REPLACEMENT_CATCHER ${computationData.calculationValue}`
    //     );
    //     const getCalculationDisplayChar = (char) => {
    //         //
    //         let _key = functionKeys.find((k) => {
    //             return k.value === char;
    //         });
    //         if (_key && _key.calculationDisplayChar) {
    //             return _key.calculationDisplayChar;
    //         } else {
    //             return char;
    //         }
    //     };
    //     let idx = patternStack.UNICHAR_REPLACEMENT_CATCHER.exec(
    //             computationData.calculationValue
    //         ).index,
    //         _charToReplace = computationData.calculationValue.charAt(idx);
    //     // _charToReplace = "s";

    //     computationData.calculationValue =
    //         computationData.calculationValue.replace(
    //             // "/",
    //             _charToReplace,
    //             getCalculationDisplayChar(_charToReplace)
    //         );

    //     computationData.updateUserInput = true;
    //     console.log(
    //         computationData.calculationValue
    //             .charAt(idx)
    //             .codePointAt(0)
    //             .toString(16)
    //     );
    //     return computationData;
    // },
};

const pregReplaceOperators = (computationData) => {
    //
};

const getPatternOperation = formatComputableString2(repairStack);

export default formatComputableString;
