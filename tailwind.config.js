const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./app/**/*.tsx", "./pages/**/*.tsx", "./components/**/*.tsx", "./lib/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", ...fontFamily.sans],
        serif: ["var(--font-serif)", "Lora", ...fontFamily.serif],
        mono: ["var(--font-mono)", "JetBrains Mono", ...fontFamily.mono],
        mono2: ["var(--font-mono2)", "IBM Plex Mono", ...fontFamily.mono],
      },
      colors: {
        "accent-warm": {
          50: "hsl(32, 100%, 97%)",
          100: "hsl(27, 100%, 94%)",
          200: "hsl(21, 100%, 89%)",
          300: "hsl(17, 100%, 81%)",
          400: "hsl(12, 100%, 71%)",
          500: "hsl(7, 93%, 60%)",
          600: "hsl(2, 80%, 51%)",
          700: "hsl(357, 81%, 42%)",
          800: "hsl(352, 78%, 35%)",
          900: "hsl(347, 69%, 31%)",
          950: "hsl(341, 82%, 15%)",
        },
        "accent-cool": {
          50: "hsl(235, 73%, 97%)",
          100: "hsl(230, 74%, 94%)",
          200: "hsl(234, 71%, 89%)",
          300: "hsl(233, 67%, 82%)",
          400: "hsl(239, 65%, 74%)",
          500: "hsl(243, 61%, 63%)",
          600: "hsl(248, 55%, 59%)",
          700: "hsl(248, 42%, 51%)",
          800: "hsl(248, 40%, 41%)",
          900: "hsl(246, 35%, 34%)",
          950: "hsl(248, 35%, 20%)",
        },
      },
      animation: {
        "spin-slow": "spin 5s linear infinite",
        wiggle: "wiggle .8s ease-in-out infinite",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-5deg)" },
          "50%": { transform: "rotate(5deg)" },
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.900"),
            a: {
              color: theme("colors.accent-warm.600"),
            },
            code: {
              color: theme("colors.pink.500"),
              fontWeight: "normal",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            "blockquote p:first-of-type::before": false,
            "blockquote p:last-of-type::after": false,
          },
        },
        dark: {
          css: {
            color: theme("colors.gray.200"),
            a: {
              color: theme("colors.accent-cool.400"),
            },
            blockquote: {
              borderLeftColor: theme("colors.gray.700"),
              color: theme("colors.gray.300"),
            },
            "h1,h2,h3,h4": {
              color: theme("colors.gray.100"),
            },
            hr: { borderColor: theme("colors.gray.700") },
            ol: {
              li: {
                "&:before": { color: theme("colors.gray.500") },
              },
            },
            ul: {
              li: {
                "&:before": { backgroundColor: theme("colors.gray.500") },
              },
            },
            strong: { color: theme("colors.gray.300") },
            thead: {
              color: theme("colors.gray.100"),
            },
            tbody: {
              tr: {
                borderBottomColor: theme("colors.gray.700"),
              },
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
