import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // レギュレーションカラーパレット
        primary: {
          blue: "#2C5DFF",
          DEFAULT: "#2C5DFF",
        },
        secondary: {
          blue: "#0133D8",
          DEFAULT: "#0133D8",
        },
        tertiary: {
          blue: "#7F9DFE",
          DEFAULT: "#7F9DFE",
        },
        background: {
          blue: "#F1F4FF",
          DEFAULT: "#F1F4FF",
        },
        gray: {
          blue: "#F9FAFC",
          DEFAULT: "#82889D",
          50: "#F9FAFC",
          100: "#F1F4FF",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#82889D",
          600: "#6B7280",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
        regulation: {
          black: "#001350",
          yellow: "#FFCE2C",
          green: "#1DCE85",
          red: "#FF2C5D",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "#FF2C5D",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#F9FAFC",
          foreground: "#82889D",
        },
        accent: {
          DEFAULT: "#F1F4FF",
          foreground: "#001350",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
