const colors: { [index: string]: ColorScheme } = {
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
        mainColor: "#",
        secondaryColor: "#",
        mainBackground: "#",
        secondaryBackground: "#",
    },
};

export default colors;

type ColorScheme = {
    mainColor: string;
    secondaryColor: string;
    mainBackground: string;
    secondaryBackground: string;
};
