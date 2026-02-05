import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "#FFCC00", // Anel de foco agora é Amarelo Trânsito
        background: "#0A0E17", // Fundo escuro profundo para destacar o logo
        foreground: "#FFFFFF",
        primary: {
          DEFAULT: "#0038A8", // Azul Royal do Logo
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFCC00", // Amarelo Ouro do "2026"
          foreground: "#000000",
        },
        success: {
          DEFAULT: "#2AD13D", // Verde do selo de Check
          foreground: "#FFFFFF",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#1F2937",
          foreground: "#9CA3AF",
        },
        accent: {
          DEFAULT: "#FFCC00",
          foreground: "#000000",
        },
        popover: {
          DEFAULT: "#0A0E17",
          foreground: "#FFFFFF",
        },
        card: {
          DEFAULT: "#111827", // Card levemente mais claro que o fundo
          foreground: "#FFFFFF",
        },
        // Mantendo compatibilidade com seu código original
        "brand-primary": "#0038A8",
        "brand-secondary": "#FFCC00",
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