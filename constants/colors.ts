const colors: { [index in SchemeName]: ColorScheme } = {
    dark: {
        mainColor: "#F73D93",
        secondaryColor: "#E195AB",
        mainBackground: "#413F42",
        secondaryBackground: "#7F8487",
    },
    light: {
        mainColor: "#EC7FA9",
        secondaryColor: "#BE5985",
        mainBackground: "#FFEDFA",
        secondaryBackground: "#FFB8E0",
    },
    blue: {
        // mainColor: "hsl(212, 96%, 90%)",
        mainColor: "#cde4fe",
        // secondaryColor: "hsl(212, 96%, 70%)",
        secondaryColor: "#69aefc",
        // mainBackground: "hsl(212, 96%, 30%)",
        mainBackground: "#034896",
        // secondaryBackground: "hsl(212, 96%, 40%)",
        secondaryBackground: "#045fc8",
    },
    lightblue: {
        // mainColor: "hsl(212, 96%, 30%)",
        mainColor: "#034896",
        // secondaryColor: "hsl(212, 96%, 50%)",
        secondaryColor: "#0577fa",
        // mainBackground: "hsl(212, 96%, 90%)",
        mainBackground: "#cde4fe",
        // secondaryBackground: "hsl(212, 96%, 70%)",
        secondaryBackground: "#69aefc",
    },
    forest: {
        // mainColor: "hsla(65, 78%, 79%, 1.00)",
        mainColor: "#ecf3a0",
        // secondaryColor: "hsla(78, 33%, 50%, 1.00)",
        secondaryColor: "#90aa55",
        // mainBackground: "hsla(120, 100%, 22%, 1.00)",
        mainBackground: "#007000",
        // secondaryBackground: "hsla(101, 100%, 35%, 1.00)",
        secondaryBackground: "#39b300",
    },
    black: {
        // mainColor: "hsla(0, 0%, 100%, 1.00)",
        mainColor: "#ffffff",
        // secondaryColor: "hsla(0, 0%, 70%, 1.00)",
        secondaryColor: "#b3b3b3",
        // mainBackground: "hsla(0, 0%, 0%, 1.00)",
        mainBackground: "#000000",
        // secondaryBackground: "hsla(0, 0%, 30%, 1.00)",
        secondaryBackground: "#4d4d4d",
    },
    white: {
        // mainColor: "hsla(0, 0%, 0%, 1.00)",
        mainColor: "#000000",
        // secondaryColor: "hsla(0, 0%, 50%, 1.00)",
        secondaryColor: "#808080",
        // mainBackground: "hsla(0, 0%, 100%, 1.00)",
        mainBackground: "#ffffff",
        // secondaryBackground: "hsla(0, 0%, 70%, 1.00)",
        secondaryBackground: "#b3b3b3",
    },
    halloween: {
        // mainColor: "hsla(16, 92%, 48%, 1.00)",
        mainColor: "#eb460a",
        // secondaryColor: "hsla(16, 92%, 30%, 1.00)",
        secondaryColor: "#932c06",
        // mainBackground: "hsla(16, 92%, 7%, 1.00)",
        mainBackground: "#220a01",
        // secondaryBackground: "hsla(16, 92%, 15%, 1.00)",
        secondaryBackground: "#491603",
    },
};

export default colors;

export type SchemeName =
    | "dark"
    | "light"
    | "blue"
    | "lightblue"
    | "forest"
    | "black"
    | "white"
    | "halloween";

export type ColorScheme = {
    mainColor: string;
    secondaryColor: string;
    mainBackground: string;
    secondaryBackground: string;
};
