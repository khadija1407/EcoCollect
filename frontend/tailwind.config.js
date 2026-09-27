/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          forest: "#14532D",
          green: "#16A34A",
          hover: "#15803D",
          mint: "#DCFCE7",
          bg: "#F7FAF8",
          card: "#FFFFFF",
          text: "#17211B",
          muted: "#6B756E",
          border: "#E5EAE6",
          warning: "#F59E0B",
          error: "#EF4444",
        },
        status: {
          pending: {
            bg: "#FEF3C7",
            text: "#92400E",
            border: "#FDE68A",
            dot: "#F59E0B"
          },
          confirmed: {
            bg: "#E0F2FE",
            text: "#0369A1",
            border: "#BAE6FD",
            dot: "#0284C7"
          },
          scheduled: {
            bg: "#DCFCE7",
            text: "#166534",
            border: "#BBF7D0",
            dot: "#16A34A"
          },
          collected: {
            bg: "#D1FAE5",
            text: "#065F46",
            border: "#A7F3D0",
            dot: "#14532D"
          },
          cancelled: {
            bg: "#FEE2E2",
            text: "#991B1B",
            border: "#FECACA",
            dot: "#EF4444"
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
