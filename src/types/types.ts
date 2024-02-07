import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { MouseEventHandler } from "react";

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
  altKey: boolean;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  keyCode: number;
  repeat: boolean;
  timeStamp: number;
  code: string;
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

export type ThemeData = {
  theme: string;
  themeType: string;
  animation: string;
  pictureType: string;
};

export type TThemeSettingsData = {
  keyboardsData: string[];
  isOpen: boolean;
};

export type TSettingsData = {
  key: number;
  keyboardName: string;
};

export type TErrorState = {
  errorState: boolean;
};

// export type TOnClick = {
//   key: IOnClickMapperStrings;
//   Function: React.MouseEventHandler<HTMLButtonElement>;
// };

// export type TOnClickName =
//   | "number"
//   | "function"
//   | "theme"
//   | "themeType"
//   | "animation"
//   | "pictureType";

// export type TOnClickMapper = {
//     number: Function: React.MouseEventHandler<HTMLButtonElement>;
//     function: Function: React.MouseEventHandler<HTMLButtonElement>;
//     theme: Function: React.MouseEventHandler<HTMLButtonElement>;
//     themeType: Function: React.MouseEventHandler<HTMLButtonElement>;
//     animation: Function: React.MouseEventHandler<HTMLButtonElement>;
//     pictureType: Function: React.MouseEventHandler<HTMLButtonElement>;
// };
// export type TOnClickMapper<T> = (
//     item: T
// ) => React.MouseEventHandler<HTMLButtonElement>;

// export interface TOnClickMapper {
//   key: string; // Add key property
//   onClick: (event: any) => void;
// }
// function: React.MouseEventHandler<HTMLButtonElement>;
// theme: React.MouseEventHandler<HTMLButtonElement>;
// themeType: React.MouseEventHandler<HTMLButtonElement>;
// animation: React.MouseEventHandler<HTMLButtonElement>;
// pictureType: React.MouseEventHandler<HTMLButtonElement>;
// };
// x

// export type IOnClickMapperStrings = Record<keyof TOnClickMapper, string>;

export type HandleClickContextType = {
  onClickFunctions: [
    MouseEventHandler<HTMLButtonElement>,
    MouseEventHandler<HTMLButtonElement>
  ];
};
