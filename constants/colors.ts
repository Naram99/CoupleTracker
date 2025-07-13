const colors: { [index: string]: ColorScheme } = {
    dark: {
        mainColor: "",
        secondaryColor: "",
        mainBackground: "",
        secondaryBackground: "",
        mainHover: "",
        secondaryHover: "",
        title: "",
    },
    light: {},
    blue: {},
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
