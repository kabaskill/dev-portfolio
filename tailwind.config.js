module.exports = {
    mode: "jit",
    purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class", // or 'media' or 'class'
    theme: {
        extend: {
            transitionDuration: {
                0: "0ms",
                2000: "2000ms",
                4000: "4000ms",
            },
            animation: {
                blink: "blink 1.5s ease-in-out infinite",
            },
            keyframes: {
                blink: {
                    "0%, 100%": { opacity: 1 },
                    "50%": { opacity: 0.5 },
                },
            },
        },
    },
    variants: {
        extend: {},
        display: ["responsive", "group-hover", "group-focus"],
    },

    plugins: [],
};
