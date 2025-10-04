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
};

export default colors;

export type SchemeName = "dark" | "light" | "blue" | "lightblue";

export type ColorScheme = {
    mainColor: string;
    secondaryColor: string;
    mainBackground: string;
    secondaryBackground: string;
};
