import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import Display from "./components/display";
import Keyboard from "./components/keyboard";
import { FireworksCanvas } from "./components/fireworks-canvas";
import { SlitherCanvas } from "./components/slither-canvas";
import { useCookies } from "react-cookie";
import SettingsIcon from "@mui/icons-material/Settings";
import { ALLOWED_KEYS, ALLOWED_STRINGS, DISALLOWED_KEYS } from "./ts/keys";
import { Container, Grid, Typography } from "@mui/material";
import * as CONSTANTS from "./utils/constants";
import { doMath } from "./utils/maths_engine.mjs";
import { unicodify } from "./utils/helpers";
import { processInput } from "./utils/process_input.mjs";
import "./styles/main.scss";
import { motion } from "framer-motion";
import * as Types from "./types/types";
import { keyMap } from "./ts/keys";
import {
  HandleClickContextProvider,
  ThemeContextProvider,
  ErrorStateContextProvider,
  SettingsDataContextProvider,
} from "./utils/context";

const Calculator = () => {
  const [cookies, setCookie] = useCookies([
    "theme",
    "themeType",
    "animation",
    "pictureType",
  ]);

  const [userInput, setUserInput] = useState("");
  const [calculationData, setCalculationData] = useState("");
  const [resultData, setResultData] = useState("");

  // const [cookies, setCookie] = useState({
  //     expires: undefined,
  //     path: undefined,
  //     label: undefined,
  //     value: undefined,
  // });
  // constructor(props) {
  //     super(props);

  //     theme = getCookie("currentTheme", "theme");
  //     themeType = getCookie("currentThemeType", "themeType");
  //     animation = getCookie("currentAnimation", "animation");
  //     pictureType = getCookie(
  //         "currentPictureType",
  //         "pictureType"
  //     );
  // }

  const isInitialMount = useRef(true);

  const handleClick = useCallback((e) => {
    e.target.blur();
    setKeyData({
      key: keyMap.get(e.target.id)!.value,
      timeStamp: e.timeStamp,
    });
  }, []);

  const handleKeyPress = useCallback((e: Types.TKeyEventData) => {
    // prevent these keys firing
    // ctrl key 17, shift key 16 alt key 18
    // mac key codes added 91-left cmd, 93-right cmd, 37-40 arrow keys
    const {
      key,
      altKey,
      shiftKey,
      ctrlKey,
      metaKey,
      keyCode,
      repeat,
      timeStamp,
      code,
    } = e;

    ////////////////
    // exceptions //
    ////////////////
    if (
      repeat ||
      DISALLOWED_KEYS.includes(keyCode) ||
      altKey ||
      ctrlKey ||
      (shiftKey && keyCode === 16) ||
      (shiftKey && keyCode === 82) ||
      (ctrlKey && keyCode === 82) ||
      (metaKey && keyCode === 82) ||
      code === "Home" ||
      code === "End" ||
      (isNaN(+key) && !ALLOWED_STRINGS.includes(key))
    )
      return;
    // if (DISALLOWED_KEYS.includes(keyCode)) return;
    // if (ALLOWED_KEYS.includes(keyCode)) {
    ////////////////
    // exceptions //
    ////////////////
    //   if (ctrlKey && key !== "") {
    //     return;
    //   }
    //   // handle shift key pressed by itself
    //   // prevent going forward
    //   // shift key only allowed with "+" key
    //   // shift key alone keyCode === 16
    //   if (shiftKey && keyCode === 16) {
    //     return;
    //   }

    //   // prevent ctrl/cmd + r triggering sqr root
    //   if ((ctrlKey && keyCode === 82) || (metaKey && keyCode === 82)) {
    //     return;
    //   }

    /* Escape & Enter & Backspace key hacks
    /*
    */
    const replaceInvalidKeyValue = (k: string): string => {
      const invalidKeyRenamer: { [key: string]: string } = {
        Escape: "a",
        Enter: "=",
        Backspace: "c",
      };
      return invalidKeyRenamer[k] ?? k;
    };
    setKeyData({
      key: replaceInvalidKeyValue(key),
      timeStamp: timeStamp,
    });

    const actions = {
      key: "",
      shiftKey: "",
      ctrlKey: "",
      metaKey: "",
      keyCode: "",
      repeat: "",
      timeStamp: "",
    };
    // return actions[action] ?()
  }, []);

  const defaultThemeData: Types.TThemeSelections = {
    theme: "ocean",
    themeType: "color",
    animation: "fireworks",
    pictureType: "still",
  };

  const [themeData, setThemeData] =
    useState<Types.TThemeSelections>(defaultThemeData);

  const onThemeDataSelect: React.MouseEventHandler<HTMLButtonElement> =
    useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        const { id, classList } = e.currentTarget as HTMLButtonElement;
        if ([...classList].includes("btn-theme")) {
          setThemeData({ ...themeData, theme: id });
        }
        if ([...classList].includes("btn-theme-type")) {
          setThemeData({ ...themeData, themeType: id });
          setSettingsKeyboardNames(
            id === "color"
              ? defaultSettingsKeyboardNames
              : id === "animation"
              ? animationSettingsKeyboardNames
              : id === "picture"
              ? pictureSettingsKeyboardNames
              : defaultSettingsKeyboardNames
          );
        }
        if ([...classList].includes("btn-animation-choose")) {
          setThemeData({ ...themeData, animation: id });
        }
        if ([...classList].includes("btn-pic-type")) {
          setThemeData({ ...themeData, pictureType: id });
        }
      },
      [themeData]
    );

  const defaultSettingsKeyboardNames = ["themeType", "theme"];
  const animationSettingsKeyboardNames = ["themeType", "theme", "animation"];
  const pictureSettingsKeyboardNames = ["themeType", "theme", "pictureType"];

  const [settingsKeyboardNames, setSettingsKeyboardNames] = useState(
    defaultSettingsKeyboardNames
  );

  const getCookieLabel = (labelId) => {
    const cookieLabelStack = {
      picture: "currentThemeType",
      color: "currentThemeType",
      animation: "currentThemeType",
      fire: "currentTheme",
      midnight: "currentTheme",
      ocean: "currentTheme",
      storm: "currentTheme",
      jungle: "currentTheme",
      slither: "currentAnimation",
      fireworks: "currentAnimation",
      still: "currentPictureType",
      moving: "currentPictureType",
    };
    return cookieLabelStack[labelId];
  };

  const [errorState, setErrorState] = useState<Types.TErrorState>({
    errorState: false,
  });

  const resetErrorState = () => {
    setErrorState({ errorState: false });
  };

  const [keyData, setKeyData] = useState<Types.TKeyData>({
    key: "",
    timeStamp: 0,
  });

  const resetKeyData = () => {
    setKeyData({ key: "", timeStamp: 0 });
  };

  // handleUserInput
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (Object.keys(keyData).length > 0) handleUserInput();
    }
  }, [keyData]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (userInput.length > 0) {
        makeCalculationData();
        tryMath();
      }
    }
  }, [userInput]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (calculationData.length > 0) {
        setLinesData({
          ...linesData,
          calculation: { ["value"]: calculationData },
        });
      }
    }
  }, [calculationData]);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (resultData && resultData.length > 0) {
        setLinesData({
          ...linesData,
          result: { ["value"]: resultData },
        });
      }
    }
  }, [resultData]);

  // makeCalculationData

  const initialSettingsData = {
    settingsKeyboardsData: defaultSettingsKeyboardNames,
    isOpen: false,
  };

  const [settingsData, setSettingsData] = useState(initialSettingsData);

  const [linesData, setLinesData] = useState({
    result: { value: "0" },
    calculation: {
      value: "",
    },
  });

  useEffect(() => {
    setDisplayData({
      settingsData: settingsData,
      linesData: linesData,
    });
  }, [settingsData, linesData]);

  useEffect(() => {
    setSettingsData({
      ...settingsData,
      settingsKeyboardsData: settingsKeyboardNames,
    });
  }, [themeData]);

  const toggleSettings = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { isOpen } = settingsData;
    // prevent when in error
    if (!errorState.errorState) {
      setSettingsData({ ...settingsData, isOpen: !isOpen });
    }
  };

  const resetSettingsData = () => {
    // setSettingsData(initialSettingsData);
    // setTheme(defaultTheme);
    // setThemeType(defaultThemeType);
  };

  const [keyError, setKeyError] = useState(false);

  const [displayData, setDisplayData] = useState({
    settingsData: settingsData,
    linesData: linesData,
  });

  // linesData calculationValue resultValue
  // useEffect(() => {
  //   setLinesData({
  //     ...linesData,
  //     calculation: {
  //       // value: computationData.calculationValue,
  //       // className: computationData.calculationClassName,
  //     },
  //     result: {
  //       // value: computationData.resultValue ? computationData.resultValue : "0",
  //       // className: computationData.resultClassName,
  //     },
  //   });
  // }, []);

  // keypress event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  });

  ////////////////////////////////////////////////////////////

  // useEffect(
  //     (cookieName) => {
  //         console.log("set cookie", cookieName);
  //         const d = new Date();
  //         const year = d.getFullYear();
  //         const month = d.getMonth();
  //         const day = d.getDate();
  //         const cookieValues = {
  //             expires: new Date(year + 1, month, day),
  //             path: "/",
  //             label: undefined,
  //             value: undefined,
  //         };
  //         setCookie(cookieName, cookieValues);
  //     },
  //     [theme, themeType, pictureType, animation]
  // );

  // const getCookie = (label, cookieDefault) => {
  //     const cookie = new Cookies();
  //     return cookie.get(label)
  //         ? cookie.get(label)
  //         : cookieDefault;
  // };

  const resetAll = () => {
    resetErrorState();
    resetKeyData();
    // resetSettingsData();
  };

  const handleUserInput = () => {
    const { key } = { ...keyData } || undefined;

    if (key === "a") {
      resetAll();
      return;
    }
    let _userInput = userInput;

    // if (key !== "m" && key !== "=" && key !== "c") {
    //   // console.log("computationData.computed", computationData.computed);
    //   // setComputationData({
    //   //     ...computationData,
    //   //     previousCalculationOperator: key,
    //   // });
    // }

    // if (key === "m" || key === "=") {
    //   return;
    // }
    setUserInput(_userInput + key);
    const _processedUserInput = processInput(userInput);
    if (_processedUserInput === "ac") {
      resetAll();
      return;
    }
    // setComputationData({
    //   ...computationData,
    //   userInput: _processedUserInput,
    //   key: key,
    // });
  };

  const tryMath = () => {
    let _resultData = doMath(userInput);
    if (_resultData) setResultData(_resultData.resultValue);
  };

  // const processResult = () => {
  //   const { computed, num1, num2, op1, op2, resultValue } = computationData;
  //   let { userInput } = computationData;
  //   if (
  //     CONSTANTS.BINARY_OPERATOR_REGEX.test(
  //       userInput.charAt(userInput.length - 1)
  //     )
  //   ) {
  //     userInput = userInput.replace(/.$/, "");
  //   }
  //   userInput = unicodify(userInput);
  //   const _resultValue = unicodify(resultValue);
  //   let resultTemplate = `Ans ${userInput} = ${_resultValue}`;

  //   let processedResultData = {
  //     computed: computed,
  //     num1: num1,
  //     num2: num2,
  //     op1: op1,
  //     op2: op2,
  //     preProcessedResult: resultValue,
  //     resultValue: resultTemplate,
  //   };
  //   return processedResultData;
  // };

  function makeCalculationData() {
    let calculationValue;
    // calculationValue =
    //   num1 && op1 && num2
    //     ? "" + num1 + op1 + num2
    //     : num1 && op1 && !num2
    //     ? "" + num1 + op1
    //     : userInput;
    // sqr root symbol hack - move it in front of numbers
    // calculationValue = /r$/.test(userInput)
    //   ? "r" + calculationValue.replace(/.$/, "")
    //   : calculationValue;
    // replace strings or sysmbols with unicode chars
    let _calculationValue = processInput(userInput);
    _calculationValue = /[x\/sry]/.test(_calculationValue)
      ? unicodify(_calculationValue)
      : _calculationValue;
    setCalculationData(_calculationValue);
  }

  const showMainKeyboards = () => {
    return (
      <motion.div
        initial={{ y: 2000, opacity: 0.25, height: 0 }}
        animate={{ height: "auto", opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          duration: 0.5,
          delay: 0.3,
        }}
      >
        <Grid container className="main-keyboards" meta-name="main-keyboards">
          <Keyboard keyboardName={"number"} />
          <Keyboard keyboardName={"function"} />
        </Grid>
      </motion.div>
    );
  };
  return (
    <ThemeContextProvider value={themeData}>
      <ErrorStateContextProvider value={errorState}>
        <Container
          className={`container ${themeData.themeType} ${themeData.theme} ${themeData.pictureType}`}
          sx={{ padding: "0!important" }}
        >
          <p
            id="settings-icon"
            className={
              settingsData.isOpen ? "settings-icon open" : "settings-icon"
            }
            onClick={toggleSettings}
          >
            <SettingsIcon sx={{ position: "relative", zIndex: -1 }} />
          </p>
          <Grid
            container
            direction={"column"}
            id="canvas-container"
            className={"calculator"}
            meta-name="display and keyboards"
          >
            {themeData.themeType === "animation" &&
              (themeData.animation === "fireworks" ? (
                <FireworksCanvas />
              ) : (
                <SlitherCanvas />
              ))}
            <Typography className="title">
              {CONSTANTS.APPLICATION_TITLE}
            </Typography>
            <HandleClickContextProvider
              value={{
                onClickFunctions: [onThemeDataSelect, handleClick],
              }}
            >
              <SettingsDataContextProvider
                value={settingsData as Types.TSettingsDataContext}
              >
                <Display {...displayData} />
              </SettingsDataContextProvider>

              {!settingsData.isOpen ? showMainKeyboards() : <></>}
            </HandleClickContextProvider>
          </Grid>
        </Container>
      </ErrorStateContextProvider>
    </ThemeContextProvider>
  );
};

export default Calculator;
