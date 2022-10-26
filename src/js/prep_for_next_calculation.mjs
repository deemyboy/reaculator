import * as CONSTANTS from "../js/constants.js";
export const prepforNextCalculation = (input) => {
    console.log("prepforNextCalculation", input);
    // return;
    const operator = input.charAt(input.length - 1);
    if (CONSTANTS.UNARY_OPERATOR_REGEX.test(operator)) {
        console.log(`UNARY_OPERATOR_REGEX ${operator}`);
    }
    if (CONSTANTS.BINARY_OPERATOR_REGEX.test(operator)) {
        console.log(`BINARY_OPERATOR_REGEX ${operator}`);
    }
};
export default prepforNextCalculation;
