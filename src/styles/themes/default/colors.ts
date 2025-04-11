export interface IColors {
  primary: string;
  secondary: string;
  bg: string;
  white: string;
  black: string;
  gray: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
  };
}

const colors: IColors = {
  primary: "#90FE3D",
  secondary: "#1A1A1A",
  bg: "#fff8ee",
  white: "#fff",
  black: "#000",
  gray: {
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
  },
};

export default colors;
