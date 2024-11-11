/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./templates/**/*.{html,twig}"],
    safelist: [
        {
            pattern: /text-(facebook|instagram|vimeo|youtube|oldred)/,
            variants: ["hover"],
        },
        "overflow-hidden",
    ],
    theme: {
        fontFamily: {
            sans: ["'Raleway'", "sans-serif"],
            serif: ["'Raleway'", "sans-serif"],
        },

        extend: {
            colors: {
                oldred: "#ff6961",
                facebook: "#1778f2",
                youtube: "#f00",
                vimeo: "#19b7ea",
                instagram: "#3f729b",
            },
            screens: {
                "2xl": "1440px",
                "3xl": "1600px",
                "4xl": "1920px",
                lorge: "2560px",
                yuge: "3840px",
            },
        },
    },
    plugins: [require("@tailwindcss/aspect-ratio")],
};
