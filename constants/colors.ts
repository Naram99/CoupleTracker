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
        mainColor: "hsl(212, 96%, 90%)",
        secondaryColor: "hsl(212, 96%, 70%)",
        mainBackground: "hsl(212, 96%, 30%)",
        secondaryBackground: "hsl(212, 96%, 40%)",
    },
    lightblue: {
        mainColor: "hsl(212, 96%, 30%)",
        secondaryColor: "hsl(212, 96%, 50%)",
        mainBackground: "hsl(212, 96%, 90%)",
        secondaryBackground: "hsl(212, 96%, 70%)",
    },
    forest: {
        mainColor: "hsla(65, 78%, 79%, 1.00)",
        secondaryColor: "hsla(78, 33%, 50%, 1.00)",
        mainBackground: "hsla(120, 100%, 22%, 1.00)",
        secondaryBackground: "hsla(101, 100%, 35%, 1.00)",
    },
    black: {
        mainColor: "hsla(0, 0%, 100%, 1.00)",
        secondaryColor: "hsla(0, 0%, 70%, 1.00)",
        mainBackground: "hsla(0, 0%, 0%, 1.00)",
        secondaryBackground: "hsla(0, 0%, 30%, 1.00)",
    },
    white: {
        mainColor: "hsla(0, 0%, 0%, 1.00)",
        secondaryColor: "hsla(0, 0%, 50%, 1.00)",
        mainBackground: "hsla(0, 0%, 100%, 1.00)",
        secondaryBackground: "hsla(0, 0%, 70%, 1.00)",
    }
};

export default colors;

export type SchemeName = "dark" | "light" | "blue" | "lightblue" | "forest" | "black" | "white";

export type ColorScheme = {
    mainColor: string;
    secondaryColor: string;
    mainBackground: string;
    secondaryBackground: string;
};
