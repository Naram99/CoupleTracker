const colors: { [index: string]: ColorScheme } = {
    dark: {
        mainColor: "#F73D93",
        secondaryColor: "#E195AB",
        mainBackground: "#413F42",
        secondaryBackground: "#7F8487",
        mainHover: "",
        secondaryHover: "",
        title: "",
    },
    light: {
        mainColor: "#EC7FA9",
        secondaryColor: "#BE5985",
        mainBackground: "#FFEDFA",
        secondaryBackground: "#FFB8E0",
        mainHover: "",
        secondaryHover: "",
        title: "",
    },
    blue: {
        mainColor: "#",
        secondaryColor: "#",
        mainBackground: "#",
        secondaryBackground: "#",
        mainHover: "",
        secondaryHover: "",
        title: "",
    },
};

export default colors;

type ColorScheme = {
    mainColor: string;
    secondaryColor: string;
    mainBackground: string;
    secondaryBackground: string;
    mainHover: string;
    secondaryHover: string;
    title: string;
};
