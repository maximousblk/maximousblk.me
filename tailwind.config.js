const { spacing, fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./pages/**/*.tsx", "./components/**/*.tsx", "./layouts/**/*.tsx"],
  darkMode: "class",
  theme: {
    colors: colors,
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.800"),
            a: {
              color: theme("colors.indigo.600"),
              "&:hover": {
                color: theme("colors.indigo.800")
              }
            },
            "h1,h2,h3,h4": {
              "scroll-margin-top": spacing[32]
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
            color: theme("colors.gray.300"),
            a: {
              color: theme("colors.indigo.400"),
              "&:hover": {
                color: theme("colors.indigo.300")
              }
            },
            blockquote: {
              borderLeftColor: theme("colors.gray.700"),
              color: theme("colors.gray.300")
            },
            "h1,h2,h3,h4": {
              color: theme("colors.gray.100"),
              "scroll-margin-top": spacing[32]
            },
            hr: { borderColor: theme("colors.gray.700") },
            ol: {
              li: {
                "&:before": { color: theme("colors.gray.500") }
              }
            },
            ul: {
              li: {
                "&:before": { backgroundColor: theme("colors.gray.500") }
              }
            },
            strong: { color: theme("colors.gray.300") },
            thead: {
              color: theme("colors.gray.100")
            },
            tbody: {
              tr: {
                borderBottomColor: theme("colors.gray.700")
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
