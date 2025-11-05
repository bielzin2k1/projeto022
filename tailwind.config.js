/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00F0FF',
          cyan: '#00D4FF',
          purple: '#9D00FF',
          pink: '#FF00E5',
          green: '#00FF94',
          yellow: '#FFE600',
          red: '#FF0055',
          orange: '#FF6B00',
        },
        dark: {
          bg: '#0D1117',
          surface: '#161B22',
          card: '#1C2128',
          border: '#30363D',
        },
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        exo: ['Exo 2', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
        'neon-strong': '0 0 15px rgba(0, 240, 255, 0.8), 0 0 30px rgba(0, 240, 255, 0.5), 0 0 45px rgba(0, 240, 255, 0.3)',
        'neon-green': '0 0 10px rgba(0, 255, 148, 0.5), 0 0 20px rgba(0, 255, 148, 0.3)',
        'neon-red': '0 0 10px rgba(255, 0, 85, 0.5), 0 0 20px rgba(255, 0, 85, 0.3)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-in': 'slide-in 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(0, 240, 255, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 20px rgba(0, 240, 255, 0.8)' },
        },
        'glow': {
          'from': { textShadow: '0 0 10px #00F0FF, 0 0 20px #00F0FF, 0 0 30px #00F0FF' },
          'to': { textShadow: '0 0 20px #00F0FF, 0 0 30px #00F0FF, 0 0 40px #00F0FF' },
        },
        'slide-in': {
          'from': { transform: 'translateX(-100%)', opacity: '0' },
          'to': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

