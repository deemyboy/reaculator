// import { patternStack } from "../utils/constants";

const computation_unit_test_data = [
    "0x0.0",
    "1x1.0",
    "123x123.0",
    "0.0x0",
    "1.0x1",
    "123.0x123",
    "    ",
    "0x0.0",
    "1x1.0",
    "123x123.0",
    "0.0x0",
    "1.0x1",
    "123.0x123",
    "    ",
    "-0x0.0",
    "-1x1.0",
    "123--123.0",
    "0.0x0",
    "-1.0x1",
    "123.0x-123",
];

const runTests = (input) => {
    let matches =
        /((?!^-?\d+\.)^-?\d*)?(^-?\d*\.?\d*)?([xy\/\-+])((?!-?\d+\.)-?\d*)?(-?\d*\.\d*$)?/d.exec(
            input
        );

    let _computationalUnit = {
        num1: "",
        num2: "",
        op1: "",
        op2: "",
    };
    if (matches) {
        _computationalUnit.num1 = matches[1] ? matches[1] : matches[2];
        _computationalUnit.op1 = matches[3];
        _computationalUnit.num2 = matches[4] ? matches[4] : matches[5];
    }
    console.log(_computationalUnit);
    return _computationalUnit;
};
const extractComputationParts = (input) => {
    //
    const re =
        /((?!^-?\d+\.)^-?\d+)?(^-?\d+\.?\d*)?([xy\/\-+])((?!-?\d+\.)-?\d+)?(-?\d+\.\d*)?([xy\/\-+=]$)|^(-?\d*\.?\d*)([rs=])$/d;

    let matches = re.exec(input);

    let computationObject = {
        num1: "",
        num2: "",
        op1: "",
        op2: "",
    };
    if (matches) {
        computationObject.num1 = matches[1] ? matches[1] : matches[2];
        computationObject.op1 = matches[3];
        computationObject.num2 = matches[4] ? matches[4] : matches[5];
        computationObject.op2 = matches[6];
    }
    return computationObject;
};

const feedTests = (arr) => {
    for (let a of arr) {
        runTests(a);
    }
};

const extractMatches = (matchesData) => {
    let indicesArr = matchesData.indices;

    let _computationalUnit = {
        num1: "",
        num2: "",
        op1: "",
        op2: "",
    };

    let num1Idx;
    let num2Idx;
    let op1Idx;
    let op2Idx;
    let count = 1;
    // for (arr of indicesArr) {
    //     if (arr) {
    //         if (count < 3) {
    //             num1Idx = arr[1];
    //         }
    //         if (count === 3) {
    //             op1Idx = arr[1];
    //         }
    //         if (count > 3) {
    //             num2Idx = arr[1];
    //         }
    //     }
    //     count++;
    // }
    for (match of matchesData) {
        console.log(match);
        if (match) {
            if (count < 3) {
                _computationalUnit.num1 = matchesData[count];
            }
            if (count === 3) {
                _computationalUnit.op1 = matchesData[count];
            }
            if (count > 3) {
                _computationalUnit.num2 = matchesData[count];
            }
        }
        count++;
    }
    return _computationalUnit;
};

console.log(feedTests(computation_unit_test_data));
