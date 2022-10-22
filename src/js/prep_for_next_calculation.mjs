import * as CONSTANTS from "../utils/constants.js";
export const prepforNextCalculation = (input) => {
    console.log("prepforNextCalculation", input);
    // return;
    const operator = input.charAt(input.length - 1);
    if (CONSTANTS.UNARY_OP_REGEX.test(operator)) {
        console.log(`UNARY_OP_REGEX ${operator}`);
    }
};
export default prepforNextCalculation;
