import { patternStack } from "../utils/constants.js";
export const formatCalculationData = (input) => {
    console.log("formatCalculationData", input);
    let _formatted = {};
    _formatted.computed = false;
    for (const key in patternStack) {
        _formatted = getPatternOperation(
            patternStack[key],
            key,
            input,
            _formatted
        );
    }
    console.log(
        "_formatted = getPatternOperation(patternStack[key], key, input);",
        _formatted
    );

    return _formatted;
};

const formatCalculationData2 = (repairs) => (pattern, name, input, result) => {
    console.log(pattern, name, input);
    if (pattern.test(input) && !result.computed) {
        let lastIndex = pattern.lastIndex;
        result.value = repairs[name](input, lastIndex);
        if (result.value) {
            result.computed = true;
        }
    }
    return result;
};

const repairStack = {
    NEG_INVISIBLE_ZERO_CATCHER: function (input) {
        console.log(`NEG_INVISIBLE_ZERO_CATCHER ${input}`);
        console.log(
            `NEG_INVISIBLE_ZERO_CATCHER - return val ${
                "-0" + input.substring(1)
            }`
        );
        return "-0" + input.substring(1);
    },
    INVISIBLE_ZERO_CATCHER: function (input) {
        console.log(`INVISIBLE_ZERO_CATCHER ${input}`);
        console.log(`INVISIBLE_ZERO_CATCHER return val ${"0" + input}`);
        return "0" + input;
    },
    UNIVERSAL_REPEATED_ZERO_CATCHER: function (input) {
        console.log(`UNIVERSAL_REPEATED_ZERO_CATCHER ${input}`);
        console.log(
            `UNIVERSAL_REPEATED_ZERO_CATCHER return val ${+input.toString()}`
        );
        return +input.toString();
    },

    UNIVERSAL_DECIMAL_CATCHER: function (input) {
        console.log(`UNIVERSAL_DECIMAL_CATCHER ${input}`);
        return input;
    },

    UNIVERSAL_DOUBLE_DOT_CATCHER: function (input) {
        console.log(`UNIVERSAL_DOUBLE_DOT_CATCHER ${input}`);
        return input.substring(0, input.length - 1);
    },
    NUM1_INTEGER_CATCHER: function (input) {
        console.log(`NUM1_INTEGER_CATCHER ${input}`);
        return input;
    },
    LEADING_ZERO_CATCHER: function (input) {
        console.log(`LEADING_ZERO_CATCHER ${input}`);
        return input.substring(1);
    },

    NUM1_INTEGER_WITH_OPERATOR_CATCHER: function (input) {
        console.log(`NUM1_INTEGER_WITH_OPERATOR_CATCHER ${input}`);
        return;
    },
    INTEGER_MATH_CATCHER: function (input, p) {
        console.log(`INTEGER_MATH_CATCHER ${input}`);
        return "";
    },
};

const getPatternOperation = formatCalculationData2(repairStack);

export default formatCalculationData;
