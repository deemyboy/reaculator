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
    keyboard: string;
};

export type TKeyboardProps = {
    name: string;
    className: string;
    showTitle: boolean;
    keyboardKeys: string;
    location: string;
};

export type TKey = {
    id: string;
    value: string;
    title: string;
    keycode: number | null;
    code: string;
    type: string;
    location: string;
    className: string;
    uniChar?: string;
    calculationDisplayChar?: string;
    ctrlKey?: boolean;
    subTitle?: string;
    showTitle?: boolean;
    selected?: boolean;
    onClick?: Function;
};

export type TTheme = {
    theme: string;
};
export type TThemeType = {
    themeType: string;
};
export type TAnimation = {
    animation: string;
};
export type TPictureType = {
    pictureType: string;
};

export type TThemeSelections = {
    theme: string;
    themeType: string;
    animation: string;
    pictureType: string;
};

export type TThemeSettingsData = {
    settingsKeyboardsData: TKeyboardProps[];
    isOpen: boolean;
};
export type TSettingsData = {
    key: number;
    keyboardName: string;
};

export type TErrorState = {
    errorState: boolean;
};
