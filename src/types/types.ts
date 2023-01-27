export type TCookieData = {
    label: string;
    value: string;
    path: string;
};

export type TKeyData = {
    key: string;
    timeStamp: string;
};
export type TComputationData = {
    userInput: string;
    resultValue: string;
    resultClassName: string;
    calculationValue: string;
    calculationClassName: string;
    computed: string;
    num1: string;
    op1: string;
    num2: string;
    op2: string;
    error: boolean;
    previousCalculationOperator: string;
    key: string;
    timeStamp: string;
    nextUserInput: string;
};
