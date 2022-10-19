const mathPatterns = {
    unary: /^-?[0-9]+\.?[0-9]*[s|r]{1}$/, // UNARY_MATHS_REGEX
    binary: /^-?[0-9]+\.?[0-9]*[+|\-|x|\/]{1}-?[0-9]+\.?[0-9]*[+|\-|x|\/]{1}$/, // BINARY_MATHS_REGEX
};
const DIGITS_PRESENT_REGEX_GREEDY = /\d+/g,
    BINARY_OP_REGEX_GREEDY = /[+\-x\/]/gi,
    UNARY_MATHS_OPERATOR_REGEX = /[sr]/i,
    UNARY_MATHS_NUMBER_REGEX = /-?[0-9]*\.?[0-9]*/,
    BINARY_MATHS_NUMBER_REGEX =
        /^-?[0-9]+\.?[0-9]*[+|\-|x|\/]{1}-?[0-9]+\.?[0-9]*[+|\-|x|\/]{1}$/,
    COMPUTATION_PATTERN =
        /(?:^(-?\.?(?:0|[1-9]\d*)\.?(?:\d*))(s|r)$|^(-?\.?(?:0|[1-9]\d*)\.?(?:\d*))(\+|\-|x|\/|y)(-?\.?(?:0|[1-9]\d*)\.?(?:\d*))(\+|\-|x|\/|y)$)/,
    DOUBLE_HYPHEN_PRESENT_REGEX = /(\d+-{2}\d+)/g,
    DOUBLE_HYPHEN_AB_CAPTURE_REGEX = /-?\d+\.*\d*/g;

const doMaths = (input) => {
    console.log("input to test", input);
    console.log("test1 - testing for digits  -> ", input);
    if (!/\d+/g.test(input)) {
        console.log("test1 FAILED - NO digits present");
        return;
    }
    console.log("test1 PASSED - digits present -> ", input);
    console.log("test2 - testing for double hyphens eg -- or ----  -> ", input);
    if (input.match(/-{2}/g)) {
        console.log(
            ` double hyphens found! ",
            ${input.match(/-+/g).length},
            " input -> ",
            ${input}`
        );
        // processDoubleHyphens(input);
        // return;
    } else {
        console.log(`test 2 PASSED - NO double hyphens present `);
    }
    // test3 viable computation values
    // console.log("test3 viable computation values");
    console.log("time for doing maths!", input);
    if (input.match(COMPUTATION_PATTERN)) {
        console.log("0", input.match(COMPUTATION_PATTERN)[0]);
        console.log("1", input.match(COMPUTATION_PATTERN)[1]);
        console.log("2", input.match(COMPUTATION_PATTERN)[2]);
        console.log("3", input.match(COMPUTATION_PATTERN)[3]);
        console.log("4", input.match(COMPUTATION_PATTERN)[4]);
        console.log("5", input.match(COMPUTATION_PATTERN)[5]);
        console.log("6", input.match(COMPUTATION_PATTERN)[6]);
    }
    // return;

    let result = input.match(COMPUTATION_PATTERN)
        ? // console.log(
          !input.match(COMPUTATION_PATTERN)[3]
            ? // unary maths
              getMathOperation(
                  input.match(COMPUTATION_PATTERN)[2],
                  input.match(COMPUTATION_PATTERN)[1]
              )
            : // binary maths
              getMathOperation(
                  input.match(COMPUTATION_PATTERN)[4],
                  input.match(COMPUTATION_PATTERN)[3],
                  input.match(COMPUTATION_PATTERN)[5]
              )
        : null;
    //   )
    null;

    if (result || result === 0) {
        console.log("and the result is ", +result);
    } else {
        console.log("maths failed");
    }
};

const doMaths2 = (obj) => (operator, num1, num2) => {
    console.log(obj[operator], operator, num1, num2);
    return operator === "s"
        ? obj[operator](num1)
        : operator === "r"
        ? obj[operator](num1)
        : operator === "x"
        ? obj[operator](num1, num2)
        : operator === "y"
        ? obj[operator](num1, num2)
        : operator === "+"
        ? obj[operator](num1, num2)
        : operator === "-"
        ? obj[operator](num1, num2)
        : operator === "/"
        ? obj[operator](num1, num2)
        : "banana";
};

const processDoubleHyphens = (input) => {
    console.log("processing DoubleHyphens", input);
    let match,
        re = /-/g,
        matches = [];
    while ((match = re.exec(input)) !== null) {
        // console.log("match found at " + match.index, match.length, input);
        matches.push(match.index);
    }
    console.log(`'hyphen count ->  ${matches.length}, matches -> ${matches}`);
    console.log(
        `DOUBLE_HYPHEN_PRESENT_REGEX test ->  ${input} : ${DOUBLE_HYPHEN_PRESENT_REGEX.test(
            input
        )}
        
        `
    );
    DOUBLE_HYPHEN_PRESENT_REGEX.lastIndex = 0;
    if (DOUBLE_HYPHEN_PRESENT_REGEX.test(input)) {
        handleSubtractNegativeNumber(input);
    } else {
        console.log(`no true double hyphens such as '43.5--6' were found`);
        return;
    }

    return;
};

const handleSubtractNegativeNumber = (input) => {
    console.log("handleSubtractNegativeNumber", input);
    // console.log(
    //     "-",
    //     input.match(DOUBLE_HYPHEN_AB_CAPTURE_REGEX)[0],
    //     input.match(DOUBLE_HYPHEN_AB_CAPTURE_REGEX)[1]
    // );
    let num1, num2;
    if (input.match(DOUBLE_HYPHEN_AB_CAPTURE_REGEX)) {
        if (input.match(DOUBLE_HYPHEN_AB_CAPTURE_REGEX)[1] < 0) {
            num2 = `(${input.match(DOUBLE_HYPHEN_AB_CAPTURE_REGEX)[1]})`;
        }
    }
    num1 = input.match(DOUBLE_HYPHEN_AB_CAPTURE_REGEX)[0];
    if (!num2) {
        num2 = input.match(DOUBLE_HYPHEN_AB_CAPTURE_REGEX)[1];
    }
    return getMathOperation("-", num1, num2);
};

const math = {
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

const getMathOperation = doMaths2(math);

let st = "9r";
let sta = "9.r";
let st2 = ".s";
let st2a = ".9s";
let st2b = "9.s";
let st2c = "9y";
let str = "9r6x";
let stra = "9.r9435x";
let str2 = ".s9435x";
let str2a = ".9s9435x";
let str2b = "9.s9435x";
let str2c = "9s9435x";
let str3 = "9x6";
let str3b = "9x6x";
let str3a = "9+6x";
let str4 = "9y3x";
let str5 = "9-3x";
let str6 = "9/2x";
let str7 = "9-2-";
let str7a = "-9-2-";
let str7b = "9--2-";
let str7c = "-9--2-";
let str8 = "--9--2-";
let str9 = "-9+-2-";
let str10 = "94342.656--2x";
let str10a = "94342.656----2x";
let str11 = "------------";
let str11a = "------3--";
let str12 = ".";
let str13 = "......";
let str14 = "";
let str15 = " ";
let str16 = "   ";

// console.log(doMaths(str)); // "9r6x";
// console.log(doMaths(stra)); // "9.r9435x";
// console.log(doMaths(str2)); // ".s9435x";
// console.log(doMaths(str2a)); // ".9s9435x";
// console.log(doMaths(str2b)); // "9.s9435x";
// console.log(doMaths(str2c)); // "9s9435x";
// console.log(doMaths(str3)); // "9x6";
// console.log(doMaths(str3b)); // "9x6x";
// console.log(doMaths(str3a)); // "9+6x";
// console.log(doMaths(str4)); // "9y3x";
// console.log(doMaths(str5)); // "9-3x";
// console.log(doMaths(str6)); // "9/2x";
// console.log(doMaths(str7)); // "9-2-";
// console.log(doMaths(str7a)); // "-9-2-";
// console.log(doMaths(str7b)); // "9--2-";
// console.log(doMaths(str7c)); // "-9--2-";
// console.log(doMaths(str8)); // "--9--2-";
// console.log(doMaths(str9)); // "-9+-2-";
// console.log(doMaths(str10)); // "94342.656--2x";
// console.log(doMaths(str10a)); // "94342.656----2x";
// console.log(doMaths(str11)); // "------------";
// console.log(doMaths(str11a)); // "------3--";
// console.log(doMaths(str12)); // ".";
// console.log(doMaths(str13)); // "......";
// console.log(doMaths(str14)); // "";
// console.log(doMaths(str15)); // " ";
// console.log(doMaths(str16)); // "   ";

testData = [
    // "9r",
    // "9.r",
    // ".s",
    // ".9s",
    // "9.s",
    // "9y",
    // "9r6x",
    // "9.r9435x",
    // ".s9435x",
    // ".9s9435x",
    // "9.s9435x",
    // "9s9435x",
    // "9x6",
    // "9x6x",
    // "9+6x",
    // "9y3x",
    // "9-3x",
    "-9.534/2x",
    "9-2-",
    "-9--2-",
    "-9+2-",
    "9+-2-",
    "9--2-",
    "9--5-",
    "9+-9-",
    "-9+-2-",
    "-9--2-",
    "94342.656--2x",
    "94342.656----2x",
    "------------",
    "------3--",
    ".",
    "......",
    "",
    " ",
    "   ",
];

const runTests = (data, pattern) => {
    for (d of data) {
        console.log("====================================");
        // console.log("test", d, pattern.test(d));
        // console.log("exec", pattern.exec(d));
        // console.log("match", d, d.match(pattern));
        console.log("doMaths", doMaths(d));
    }
};

// runTests(testData, DOUBLE_HYPHEN_AB_CAPTURE_REGEX);
// runTests(testData, COMPUTATION_PATTERN);
runTests(testData);
