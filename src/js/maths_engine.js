const mathPatterns = {
    unary: /^-?[0-9]+\.?[0-9]*[s|r]{1}$/, // UNARY_MATHS_REGEX
    binary: /^-?[0-9]+\.?[0-9]*[+|\-|x|\/]{1}-?[0-9]+\.?[0-9]*[+|\-|x|\/]{1}$/, // BINARY_MATHS_REGEX
};
const DIGITS_PRESENT_REGEX_GREEDY = /\d+/g,
    COMPUTATION_PATTERN =
        /(-?[0-9]+\.?[0-9]*[s|r]{1})?(-?[0-9]+\.?[0-9]*[+|\-|x|\/]{1}-?[0-9]+\.?[0-9]*[+|\-|x|\/]{1})?/,
    BINARY_OP_REGEX_GREEDY = /[+\-x\/]/gi,
    UNARY_MATHS_OPERATOR_REGEX = /[sr]/i,
    UNARY_MATHS_NUMBER_REGEX = /-?[0-9]*\.?[0-9]*/,
    BINARY_MATHS_NUMBER_REGEX =
        /^-?[0-9]+\.?[0-9]*[+|\-|x|\/]{1}-?[0-9]+\.?[0-9]*[+|\-|x|\/]{1}$/,
    BIG_PATTERN =
        /((-?[0-9]+\.?[0-9]*)([s|r]{1}))?((-?[0-9]+\.?[0-9]*)([+|\-|x|\/|y]{1})(-?[0-9]+\.?[0-9]*)([+|\-|x|\/]{1}))?/,
    DOUBLE_HYPHEN_PRESENT_REGEX = /\d+-{2}\d+/g,
    DOUBLE_HYPHEN_AB_CAPTURE_REGEX = /-?\d+\.*\d*/g;

const doMaths = (input) => {
    console.log("input to test", input);
    console.log("test1 - testing for digits  -> ", input);
    if (!/\d+/g.test(input)) {
        console.log("test1 FAILED - NO digits present");
        return;
    }
    console.log("test1 PASSED - digits present -> ", input);
    console.log("test2 - testing hyphens -> ", input);
    if (input.match(/-{2}/g)) {
        console.log(
            `"FAILED - number of hyphens > 1 -> ",
            ${input.match(/-+/g).length},
            " input -> ",
            ${input}`
        );
        processHyphens(input);
    }
    console.log(
        `"test 2 PASSED - number of hyphens 1 or less -> ",
     ${input.match(/-+/g)},
        " input -> ",
        ${input}`
    );
    // console.log(input, COMPUTATION_PATTERN.exec(input));
    console.log("doing maths!", input);
    console.log(
        input.match(BIG_PATTERN)[1]
            ? getMathOperation(
                  input.match(BIG_PATTERN)[3],
                  input.match(BIG_PATTERN)[2]
              )
            : getMathOperation(
                  input.match(BIG_PATTERN)[6],
                  input.match(BIG_PATTERN)[5],
                  input.match(BIG_PATTERN)[7]
              )
    );
};

const doMaths2 = (obj) => (operator, num1, num2) => {
    console.log(obj[operator], typeof operator, num1, num2);
    return operator === "s"
        ? obj[operator](num1, 2)
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
        : "";
};

const processHyphens = (input) => {
    console.log("processHyphens", input);
    let match,
        re = /-/g,
        matches = [];
    while ((match = re.exec(input)) !== null) {
        // console.log("match found at " + match.index, match.length, input);
        matches.push(match.index);
    }
    console.log(`'hyphen count ->  ${matches.length}, matches -> ${matches}`);
    console.log(`DOUBLE_HYPHEN_PRESENT_REGEX test ->  ${input}`);
    if (DOUBLE_HYPHEN_PRESENT_REGEX.test(input)) {
        handleSubtractMinusNumber(input);
    }

    return;
};

const handleSubtractMinusNumber = (input) => {
    console.log("handleSubtractMinusNumber", input);
    console.log(
        "-",
        input.match(DOUBLE_HYPHEN_AB_CAPTURE_REGEX)[0],
        input.match(DOUBLE_HYPHEN_AB_CAPTURE_REGEX)[1]
    );
    return getMathOperation(
        "-",
        input.match(DOUBLE_HYPHEN_AB_CAPTURE_REGEX)[0],
        input.match(DOUBLE_HYPHEN_AB_CAPTURE_REGEX)[1]
    );
    return;
};

const math = {
    r: Math.sqrt,
    s: Math.pow,
    x: function (a, b) {
        return a * b;
    },
    y: function (a, b) {
        return a ** b;
    },
    "+": function (a, b) {
        return +a + +b;
    },
    "-": function (a, b) {
        return +a - +b;
    },
    "/": function (a, b) {
        return +a / +b;
    },
};

const getMathOperation = doMaths2(math);

let str = "9x6x";
let str2 = "9.r9435x";
let str2a = "9.s9435x";
let str3 = "9+6x";
let str4 = "9y3x";
let str5 = "9-3x";
let str6 = "9/2x";
let str7 = "9-2-";
let str8 = "-9--2-";
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
// console.log(doMaths(str)); //  "9x6x"
console.log(doMaths(str2)); //  "9.r9435x"
console.log(doMaths(str2a)); //  "9.s9435x"
// console.log(doMaths(str3)); //  "9+6x"
// console.log(doMaths(str4)); //  "9y3x"
// console.log(doMaths(str5)); //  "9-3x"
// console.log(doMaths(str6)); //  "9/2x"
// console.log(doMaths(str7)); //  "9-2-"
// console.log(doMaths(str8)); //  "-9--2-"
// console.log(doMaths(str9)); //  "-9+-2-"
// console.log(doMaths(str10)); //  "94342.656--2x"
// console.log(doMaths(str10a)); //  "94342.656----2x"
// console.log(doMaths(str11)); //  "------------------------------"
// console.log(doMaths(str11a)); //  "---3---------------------------"
// console.log(doMaths(str12)); //  "."
// console.log(doMaths(str13)); //  "......"
// console.log(doMaths(str14)); //  ""
// console.log(doMaths(str15)); //  " "
// console.log(doMaths(str16)); //  "   "
testValues = [
    "-9s",
    "--9s",
    "95.6r",
    "95..6r",
    "95.6r34.5x",
    "95.6+34.5x",
    "95.6x",
    "95.6/",
    "95.6-34.5y",
    "95.6-34.5r",
    "95.6+-34.5-",
    "95.6+--34.5-",
    "95.6--34.5-",
    "95.6-34..5-",
    "-95.6-34.5-",
    "-95.6-x345-",
    "-95.6-345-",
];
