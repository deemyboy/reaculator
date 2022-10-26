testPats = (input) => {
    const patternStack = [/^-?0\d+\.?\d*/, /(?!^0\d+\.?)^(-?\d*\.?\d*)([rs])/];
    let found = false,
        previous,
        count = 0;
    for (const p of patternStack) {
        console.log(`count ${count} | ${p}  | input ${input} : ${p} :`);

        if (p.test(input)) {
            console.log(` a match was found for leading zero in input ${input}
            it will be modified`);
            input = input.substring(1);
            console.log(`after ${input}
            it will be modified`);
        }
        // else if (count > 0) {
        //     console.log(
        //         `${input} was matched by the previous pattern ${previous}`
        //     );
        // } else {
        //     `${input} was not matched by the pattern ${previous}`;
        // }
        count++;
    }
};

testStrings = (input) => {
    const patternStack = [/^-?0\d+\.?\d*/, /(?!^0\d+\.?)^(-?\d*\.?\d*)([rs])/];
    let found = false,
        previous;
    let count = 0;
    for (p of patternStack) {
        console.log(`count ${count} | ${p}  | input ${input}`);

        if (count === 0) {
            if (p.test(input)) {
                console.log(` a match was found for leading zero in input ${input}
            it will be modified`);
                found = true;
                input = input.substring(1);
                console.log(`after ${input}
            it will be modified`);
            }
        } else {
            console.log(
                `${input} was matched by the previous pattern ${previous}`
            );
        }
        count++;
    }
};

feedStrings = (input) => {
    let c = 0;
    for (const i of input) {
        console.log(c, testPats(i));
        c++;
    }
};

feedPats = (input) => {
    console.log(input.length);
    let c = 0;
    for (const i of input) {
        console.log(c, testStrings(i));
        c++;
    }
};

td = [
    // "466569s",
    // "00000131r",
    // "010203s",
    // "45s",
    "56r",
    "056s",
    // "5s",
    // "0r",
    // "06s",
    // "0",
    // "0s",
    // "05s",
    // "5r",
    // "50s",
    // "5r",
    // "5555s",
    // "5000r",
    // "050000s",
    // "05.0s",
    // "5.0s",
    // "5.s",
    // "50.01s",
    // "0.0r",
    // "0.s",
    // "-0.0r",
    // "-0.s",
    // "0.0r",
    // "0.s",
    // "-466569.0s",
    // "5646468.1r",
    // "45.000s",
    // "56.0101r",
    // "056.098s",
    // "5s",
    // "00.s",
    // "05.s",
    // "005s",
    // ".0r",
    // "0.s",
    // "-.0r",
    // "-0.s",
    // "0.0r",
    // "0.s",
    // "-0.0r",
    // "-0.01s",
    // "56.0101r",
    // "056.098s",
    // "5s",
    // "00.3s",
    // "5.3s",
    // "5.000000s",
    // ".000000r",
    // "0000.s",
    // "-.0r",
    // "-0.s",
    // "0.0r",
    // "0.s",
    // "-0.0r",
    // "-0.01s",
    // "06s",
    // "-0",
    // "-0s",
    // "-05s",
    // "-5r",
    // "-50s",
    // "5r",
    // "5555s",
    // "5000r",
    // "-50000s",
];

// feedStrings(td);
feedPats(td);
