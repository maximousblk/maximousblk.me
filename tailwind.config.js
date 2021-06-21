const { spacing, fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.tsx", "./components/**/*.tsx", "./layouts/**/*.tsx"],
  darkMode: "class",
  theme: {
    colors: colors,
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
        mono: ["JetBrains Mono", ...fontFamily.mono]
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.800"),
            a: {
              color: theme("colors.indigo.600")
            },
            code: {
              color: theme("colors.pink.500"),
              fontWeight: "normal"
            },
            "code::before": {
              content: '""'
            },
            "code::after": {
              content: '""'
            },
            "blockquote p:first-of-type::before": false,
            "blockquote p:last-of-type::after": false
          }
        },
        dark: {
          css: {
            color: theme("colors.coolGray.300"),
            a: {
              color: theme("colors.indigo.400")
            },
            blockquote: {
              borderLeftColor: theme("colors.coolGray.700"),
              color: theme("colors.coolGray.300")
            },
            "h1,h2,h3,h4": {
              color: theme("colors.coolGray.100")
            },
            hr: { borderColor: theme("colors.coolGray.700") },
            ol: {
              li: {
                "&:before": { color: theme("colors.coolGray.500") }
              }
            },
            ul: {
              li: {
                "&:before": { backgroundColor: theme("colors.coolGray.500") }
              }
            },
            strong: { color: theme("colors.coolGray.300") },
            thead: {
              color: theme("colors.coolGray.100")
            },
            tbody: {
              tr: {
                borderBottomColor: theme("colors.coolGray.700")
              }
            }
          }
        }
      })
    }
  },
  variants: {
    typography: ["dark"]
  },
  plugins: [require("@tailwindcss/typography")]
};
