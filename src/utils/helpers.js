import { keyboardKeysMap } from "../ts/keys";
export const deunicodify = (str) => {
    let count = 0;
    [...str].forEach((c) => {
        if (/\d|\./.test(c)) {
            count++;
            return;
        }
        [...keyboardKeysMap.get("func")].forEach((k) => {
            if (k.calculationDisplayChar && k.calculationDisplayChar === c) {
                str = str.replace(str.charAt(count), k.value);
            }
        });
        count++;
    });
    return str;
};

export const unicodify = (str) => {
    let count = 0;
    [...str].forEach((c) => {
        if (/\d|\./.test(c)) {
            count++;
            return;
        }
        [...keyboardKeysMap.get("func")].forEach((k) => {
            if (k.calculationDisplayChar && k.value === c) {
                str = str.replace(str.charAt(count), k.calculationDisplayChar);
            }
        });
        count++;
    });
    return str;
};
