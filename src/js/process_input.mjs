import { patternStack } from "./constants.js";
import { functionKeys } from "./keys.js";
import {
    convertFromUnicodeToChar,
    convertFromCharToUnicode,
} from "./maths_engine.mjs";

export const processInput = (computationData) => {
    // console.log("processInput", computationData);
    computationData.rawUserInput = convertFromUnicodeToChar(
        computationData.rawUserInput
    );
    let _formattedData;
    // if (computationData.computed) {
    //     // console.log("we just completed a math!", computationData);
    //     delete computationData.computed;
    //     // console.log(computationData.rawUserInput.charAt(computationData.rawUserInput.length - 1));
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
    if (_formattedData.rawUserInput) {
        _formattedData.rawUserInput = convertFromCharToUnicode(
            _formattedData.rawUserInput
        );
    }

    return _formattedData;
};

const purifyRawUserInput2 =
    (repairs) => (pattern, name, computationData, formattedData) => {
        // console.log("purifyRawUserInput2", name, computationData, formattedData);
        if (pattern.test(computationData.rawUserInput) && !formattedData) {
            console.log(
                "purifyRawUserInput2 |",
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
        console.log(`INITIAL_OPERATOR_CATCHER ${computationData.rawUserInput}`);
        computationData.rawUserInput = "";
        return computationData;
    },
    NUM1_INVISIBLE_ZERO_CATCHER: function (computationData) {
        console.log(
            `NUM1_INVISIBLE_ZERO_CATCHER ${computationData.rawUserInput}`
        );
        computationData.rawUserInput = "0" + computationData.rawUserInput;
        return computationData;
    },
    NUM2_INVISIBLE_ZERO_CATCHER: function (computationData) {
        console.log(
            `NUM2_INVISIBLE_ZERO_CATCHER ${computationData.rawUserInput}`
        );
        let _value = computationData.rawUserInput;
        let matches = patternStack.NUM2_INVISIBLE_ZERO_CATCHER.exec(_value);

        let idx = matches.indices[1][0];
        let _num1 = _value.substring(0, idx);
        let _num2 = _value.substring(idx + 1);
        let _operator = _value.substring(idx, idx + 1);
        _num2 = "0" + _num2;
        computationData.rawUserInput = _num1 + _operator + _num2;
        return computationData;
    },
    NUM2_INVISIBLE_ZERO_OPERATOR_CATCHER: function (computationData) {
        console.log(
            `NUM2_INVISIBLE_ZERO_OPERATOR_CATCHER ${computationData.rawUserInput}`
        );
        let _value = computationData.rawUserInput;
        let matches =
            patternStack.NUM2_INVISIBLE_ZERO_OPERATOR_CATCHER.exec(_value);

        let idx = matches.indices[1][0];
        let _num1 = _value.substring(0, idx);
        let _num2 = _value.substring(idx + 1);
        let _operator = _value.substring(idx, idx + 1);
        _num2 = "0" + _num2;
        computationData.rawUserInput = _num1 + _operator + _num2;
        return computationData;
    },
    NUM1_TRAILING_DECIMAL_ZERO_CATCHER: function (computationData) {
        console.log(
            `NUM1_TRAILING_DECIMAL_ZERO_CATCHER ${computationData.rawUserInput}`
        );
        let _value = computationData.rawUserInput;
        let matches = _value.match(
            patternStack.NUM1_TRAILING_DECIMAL_ZERO_CATCHER
        );
        if (matches) {
            if (matches.indices[2]) {
                let _operator = _value.charAt(_value.length - 1);
                _value = _value.replace(/.$/, "");
                _value = Number(_value).toString();
                computationData.rawUserInput = _value + _operator;
            }
        }
        return computationData;
    },
    NUM2_REPEATED_INITIAL_ZERO_CATCHER: function (computationData) {
        console.log(
            `NUM2_REPEATED_INITIAL_ZERO_CATCHER ${computationData.rawUserInput}`
        );
        let _value = computationData.rawUserInput;
        let matches = _value.match(
            patternStack.NUM2_REPEATED_INITIAL_ZERO_CATCHER
        );
        if (matches) {
            _value = _value.replace(/.$/, "");
            computationData.rawUserInput = _value;
        }

        return computationData;
    },
    NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER: function (
        computationData
    ) {
        console.log(
            `NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER ${computationData.rawUserInput}`
        );
        let matches = computationData.rawUserInput.match(
            patternStack.NUM2_REPEATED_ZERO_IN_DECIMAL_WITH_OPERATOR_CATCHER
        );
        // 0.00x <- float num2 + operator
        if (matches) {
            let _num1 = matches[1];
            let _op1 = matches[2];
            let _op2 = matches[4];
            computationData.rawUserInput = _num1 + _op1 + "0" + _op2;
        }

        return computationData;
    },
    NUM1_REPEATED_ZERO_CATCHER: function (computationData) {
        console.log(
            `NUM1_REPEATED_ZERO_CATCHER ${computationData.rawUserInput}`
        );
        computationData.rawUserInput = Number(
            computationData.rawUserInput
        ).toString();
        return computationData;
    },

    UNIVERSAL_EXTRA_DOT_CATCHER: function (computationData) {
        // console.log(`UNIVERSAL_EXTRA_DOT_CATCHER ${computationData.rawUserInput}`);
        computationData.rawUserInput = computationData.rawUserInput.substring(
            0,
            computationData.rawUserInput.length - 1
        );
        return computationData;
    },
    UNIVERSAL_DOUBLE_DOT_CATCHER: function (computationData) {
        // console.log(`UNIVERSAL_DOUBLE_DOT_CATCHER ${computationData.rawUserInput}`);
        computationData.rawUserInput = computationData.rawUserInput.substring(
            0,
            computationData.rawUserInput.length - 1
        );
        return computationData;
    },
    NUM1_INTEGER_WITH_OPERATOR_CATCHER: function (computationData) {
        // console.log(`NUM1_INTEGER_WITH_OPERATOR_CATCHER ${computationData.rawUserInput}`);
        computationData.rawUserInput = computationData.rawUserInput.substring(
            0,
            computationData.rawUserInput.length - 1
        );
        return computationData;
    },
    UNNARY_MATH_CATCHER: function (computationData) {
        // console.log(`UNNARY_MATH_CATCHER ${computationData.rawUserInput}`);
        return computationData;
    },
    BINARY_MATH_CATCHER: function (computationData) {
        // console.log(`BINARY_MATH_CATCHER ${computationData.rawUserInput}`);
        return computationData;
    },
    MATH_CATCHER: function (computationData) {
        // console.log(`MATH_CATCHER ${computationData.rawUserInput}`);
        return computationData;
    },
    DOUBLE_OPERATOR_CATCHER: function (computationData) {
        // console.log(`DOUBLE_OPERATOR_CATCHER ${computationData.rawUserInput}`);
        computationData.rawUserInput = computationData.rawUserInput.substring(
            0,
            computationData.rawUserInput.length - 1
        );
        return computationData;
    },
    NUM1_FLOATING_DOT_CATCHER: function (computationData) {
        // console.log(`NUM1_FLOATING_DOT_CATCHER ${computationData.rawUserInput}`);
        const re = /\./;

        computationData.rawUserInput = computationData.rawUserInput.replace(
            re,
            ""
        );
        return computationData;
    },
    NUM2_FLOATING_DOT_CATCHER: function (computationData) {
        // console.log(`NUM2_FLOATING_DOT_CATCHER ${computationData.rawUserInput}`);
        const re = /\./;

        computationData.rawUserInput = computationData.rawUserInput.replace(
            re,
            ""
        );
        return computationData;
    },
    PLUS_MINUS_CATCHER: function (computationData) {
        // console.log(`PLUS_MINUS_CATCHER ${computationData.rawUserInput}`);
        let _value = computationData.rawUserInput;
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
            computationData.rawUserInput = _value;
        }
        return computationData;
    },
    M_CATCHER: function (computationData) {
        // console.log(`M_CATCHER ${computationData.rawUserInput}`);
        computationData.rawUserInput = computationData.rawUserInput.replace(
            /.$/,
            ""
        );
        return computationData;
    },
    C_CATCHER: function (computationData) {
        // console.log(`C_CATCHER ${computationData.rawUserInput}`);
        let _value = computationData.rawUserInput;
        let matches = _value.match(patternStack.C_CATCHER);
        if (matches) {
            computationData.rawUserInput = computationData.rawUserInput.replace(
                /.c$/,
                ""
            );
            computationData.rawUserInput = computationData.rawUserInput.replace(
                /.c$/,
                ""
            );
        }
        return computationData;
    },
    A_CATCHER: function (computationData) {
        console.log(`A_CATCHER ${computationData.rawUserInput}`);
        computationData = {
            calculationClassName: "calculation",
            rawUserInput: undefined,
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
    //         `UNICHAR_REPLACEMENT_CATCHER ${computationData.rawUserInput}`
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
    //             computationData.rawUserInput
    //         ).index,
    //         _charToReplace = computationData.rawUserInput.charAt(idx);
    //     // _charToReplace = "s";

    //     computationData.rawUserInput =
    //         computationData.rawUserInput.replace(
    //             // "/",
    //             _charToReplace,
    //             getCalculationDisplayChar(_charToReplace)
    //         );

    //     console.log(
    //         computationData.rawUserInput
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

const getPatternOperation = purifyRawUserInput2(repairStack);

export default processInput;
