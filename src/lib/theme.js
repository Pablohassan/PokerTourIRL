export const theme = {
    colors: {
        primary: {
            DEFAULT: "rgb(245, 158, 11)", // amber-500
            light: "rgb(251, 191, 36)", // amber-400
            dark: "rgb(217, 119, 6)", // amber-600
            transparent: "rgba(245, 158, 11, 0.2)",
        },
        background: {
            DEFAULT: "rgb(2, 6, 23)", // slate-950
            light: "rgb(15, 23, 42)", // slate-900
            transparent: "rgba(2, 6, 23, 0.95)",
            glass: "rgba(15, 23, 42, 0.8)",
        },
        border: {
            DEFAULT: "rgba(226, 232, 240, 0.2)", // slate-200 with transparency
            highlight: "rgba(245, 158, 11, 0.2)", // amber-500 with transparency
        },
        text: {
            primary: "rgb(251, 191, 36)", // amber-400
            secondary: "rgba(251, 191, 36, 0.8)", // amber-400 with transparency
            muted: "rgba(226, 232, 240, 0.6)", // slate-200 with transparency
        },
    },
    shadows: {
        glow: "0 0 25px -5px rgba(245,158,11,0.2)",
        inner: "inset 0 2px 4px rgba(0,0,0,0.3)",
    },
    fonts: {
        display: "DS-DIGI",
        body: "system-ui, sans-serif",
    },
    borderRadius: {
        sm: "0.375rem",
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
    },
    glassMorphism: {
        background: "rgba(15, 23, 42, 0.8)",
        border: "1px solid rgba(226, 232, 240, 0.2)",
        backdropFilter: "blur(8px)",
    },
};
export const cn = (...classes) => {
    return classes.filter(Boolean).join(" ");
};
