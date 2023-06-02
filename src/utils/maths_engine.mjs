import { patternStack, VALID_COMPUTATION } from "./constants.js";

// export const doMath = ({
//     userInput,
//     resultValue,
//     resultClassName,
//     calculationValue,
//     calculationClassName,
//     computed,
//     num1,
//     op1,
//     num2,
//     op2,
//     error,
//     previousCalculationOperator,
//     key,
//     timeStamp,
//     nextUserInput,
// }) => {
export const doMath = (input) => {
  // console.log("doMath", input);
  const {
    userInput,
    resultValue,
    resultClassName,
    calculationValue,
    calculationClassName,
    computed,
    num1,
    op1,
    num2,
    op2,
    error,
    previousCalculationOperator,
    key,
    timeStamp,
    nextUserInput,
  } = input;
  const extractComputationParts = (_input) => {
    let matches = VALID_COMPUTATION.exec(_input);

    let calculationParameters = {
      num1: "",
      num2: "",
      op1: "",
      op2: "",
    };
    if (!matches) return {};
    if (matches) {
      if (matches[1]) {
        calculationParameters.num1 = matches[1];
        calculationParameters.op1 = matches[2];
        calculationParameters.num2 = matches[3];
        calculationParameters.op2 = matches[4];
      } else if (matches[6] !== "=") {
        calculationParameters.num1 = matches[5];
        calculationParameters.op1 = matches[6];
        calculationParameters.num2 = undefined;
        calculationParameters.op2 = undefined;
      }
    }
    return calculationParameters;
  };

  let _result = {},
    _computationalUnit = extractComputationParts(input);

  // console.log("time for doing maths!", input);
  if (Object.keys(_computationalUnit).length > 0) {
    _result.resultValue = getMathOperation(
      _computationalUnit.op1,
      _computationalUnit.num1,
      _computationalUnit.num2
    );
  }

  if (
    Object.keys(_result).length > 0 &&
    _result.resultValue !== undefined &&
    (!isFinite(_result.resultValue) || isNaN(_result.resultValue))
  ) {
    _result.error = true;
    _result.resultValue = "err";
    return _result;
  }

  if (
    Object.keys(_result).length > 0 &&
    (_result.resultValue || _result.resultValue === 0)
  ) {
    // console.log("and the result is ", +_result.value);
    _result.resultValue = _result.resultValue.toString();
    // _result.computed = true;
    // _result.num1 = _computationalUnit.num1;
    // _result.op1 = _computationalUnit.op1;
    // _result.num2 = _computationalUnit.num2;
    // _result.op2 = _computationalUnit.op2;
  } else {
    // _result.computed = false;
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
    ? functionStack[operator](+num1, +num2) // +n - cast to numbers
    : undefined;
};

const mathFunctionStack = {
  // square root
  r: Math.sqrt,
  // square
  s: function (a) {
    return a ** 2;
  },
  //  multiply
  x: function (a, b) {
    return a * b;
  },
  //  x raised to y
  y: function (a, b) {
    return a ** b;
  },
  //  addition
  "+": function (a, b) {
    return a + b;
  },
  //  subtraction
  "-": function (a, b) {
    return a - b;
  },
  //  division
  "/": function (a, b) {
    return a / b;
  },
};

const getMathOperation = doMath2(mathFunctionStack);

export default doMath;
