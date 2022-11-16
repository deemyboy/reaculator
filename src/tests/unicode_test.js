const functionKeys = [
    {
        id: 19,
        value: "+",
        title: "plus",
        keycode: 187,
        code: "Equal",
        type: "func",
        location: "main",
    },
    {
        id: 12,
        value: "-",
        title: "minus",
        keycode: 189,
        code: "Minus",
        type: "func",
        location: "main",
    },
    {
        id: 13,
        value: "x",
        uniChar: "\u00D7",
        calculationDisplayChar: "\u00D7",
        title: "multiply (x)",
        keycode: 88,
        code: "KeyX",
        type: "func",
        location: "main",
        subTitle: "x",
    },
    {
        id: 14,
        value: "/",
        uniChar: "\u00F7",
        calculationDisplayChar: "\u00F7",
        title: "divide (/)",
        keycode: 191,
        code: "Slash",
        type: "func",
        location: "main",
        subTitle: "/",
    },
    {
        id: 15,
        value: "s",
        uniChar: "\uD835\uDC65\u00B2",
        calculationDisplayChar: "\u00B2",
        title: "square (s)",
        keycode: 83,
        code: "KeyS",
        type: "func",
        location: "main",
        subTitle: "s",
    },
    {
        id: 21,
        value: "r",
        uniChar: "\u221A2",
        calculationDisplayChar: "\u221A",
        title: "square root (r)",
        keycode: 82,
        code: "KeyR",
        type: "func",
        location: "main",
        ctrlKey: false,
        subTitle: "r",
    },
    {
        id: 20,
        value: "y",
        uniChar: "\uD835\uDC65\u02B8",
        calculationDisplayChar: "\u02B8",
        title: "x to the power y (y)",
        keycode: 89,
        code: "KeyY",
        type: "func",
        location: "main",
        subTitle: "y",
    },
    {
        id: 16,
        value: "=",
        specialClass: "btn-success",
        title: "equals",
        keycode: 187,
        code: "Equal",
        type: "func",
        location: "main",
    },
];
const deunicodify = (str) => {
    let count = 0,
        retStr;
    [...str].forEach((c) => {
        if (/\d|\./.test(c)) {
            count++;
            return;
        }
        let found = false;
        [...functionKeys].forEach((k) => {
            if (found === false && k.calculationDisplayChar) {
                console.log(
                    str,
                    k.calculationDisplayChar === c,
                    k.calculationDisplayChar,
                    c,
                    "count",
                    count,
                    "retStr",
                    retStr
                );
                if (k.calculationDisplayChar === c) {
                    str = str.replace(str.charAt(count), k.value);
                    // found = true;
                }
            }
        });
        count++;
    });
    if (retStr) {
        return retStr;
    }
    return str;
};

const unicodify = (str) => {
    let count = 0,
        retStr;
    [...str].forEach((c) => {
        if (/\d|\./.test(c)) {
            count++;
            return;
        }
        let found = false;
        [...functionKeys].forEach((k) => {
            if (found === false && k.calculationDisplayChar) {
                console.log(
                    str,
                    k.value === c,
                    k.value,
                    c,
                    "count",
                    count,
                    "retStr",
                    retStr
                );
                if (k.value === c) {
                    str = str.replace(
                        str.charAt(count),
                        k.calculationDisplayChar
                    );
                    // found = true;
                }
            }
        });
        count++;
    });
    if (retStr) {
        return retStr;
    }
    return str;
};

s = "0.4/.5s09x8rsr";

console.log("unicodify(s)");
s2 = unicodify(s);
console.log(s2);
console.log("deunicodify(s)");

s3 = deunicodify(s2);
console.log(s3);
