import "@testing-library/jest-dom/extend-expect";
import { configure } from "@testing-library/react";
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

configure({ testIdAttribute: "data-testid" });
