import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";

export type TCookieData = {
    label: string;
    value: string;
    path: string;
};

export type TKeyData = {
    key: string;
    timeStamp: number;
};

export type TKeyEventData = {
    key: string;
    shiftKey: boolean;
    ctrlKey: boolean;
    metaKey: boolean;
    keyCode: number;
    repeat: boolean;
    timeStamp: number;
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
    preProcessedResult?: string;
};

export type TKeyBoardObject = {
    index: number;
    keyboard: ReactJSXElement;
    name: string;
};

export type TKeyBoardData = {
    keyboard: JSX.Element;
    selected?: TSelect;
    errorState?: boolean;
};

export type TKeyboard = {
    name: string;
    className: string;
    showTitle: boolean;
    keys: TKey[];
    location: string;
    id: number;
    selected?: TSelect;
    errorState?: boolean;
    onClick?: Function;
};

export type TKey = {
    id: number | string;
    value: string;
    uniChar?: string;
    calculationDisplayChar?: string;
    title: string;
    keycode: number | null;
    code: string;
    type: string;
    location: string;
    className: string;
    ctrlKey?: boolean;
    subTitle?: string;
    showTitle?: boolean;
};

export type TSelect = {
    name: string;
};

export type TThemeSelections = {
    theme: TSelect;
    themeType: TSelect;
    animation: TSelect;
    pictureType: TSelect;
};

export type TSettingsData = {
    settingsKeyboardsData: TKeyboard[];
    isOpen: boolean;
};
