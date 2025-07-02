/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales
        'color-dark-blue': '#003C53',
        'font-color-bg': '#0A4057',
        
        // Purple
        'purple': {
          50: '#f3ddef',
          100: '#e7bcde',
          200: '#db9ace',
          300: '#cf78bd',
          400: '#c357ad',
          500: '#AE3E97',
          600: '#91347e',
          700: '#742965',
          800: '#571f4b',
          900: '#3a1532',
          950: '#1d0a19',
        },
        
        // Orange
        'orange': {
          50: '#ffebd5',
          100: '#ffd6ab',
          200: '#ffc281',
          300: '#ffad57',
          400: '#ff992d',
          500: '#FF8403',
          600: '#d76e00',
          700: '#ac5800',
          800: '#814200',
          900: '#562c00',
          950: '#2b1600',
        },
        
        // Green
        'green': {
          50: '#c2ffe2',
          100: '#85ffc5',
          200: '#48ffa9',
          300: '#0bff8c',
          400: '#00cd6c',
          500: '#00904C',
          600: '#00783f',
          700: '#006033',
          800: '#004826',
          900: '#003019',
          950: '#00180d',
        },
        
        // Blue Sky
        'blue-sky': {
          50: '#d2f3ff',
          100: '#a5e6ff',
          200: '#78daff',
          300: '#4aceff',
          400: '#1dc2ff',
          500: '#00AEEF',
          600: '#0091c7',
          700: '#00749f',
          800: '#005778',
          900: '#003a50',
          950: '#001d28',
        },
        
        // Blue
        'blue': {
          50: '#dde6f7',
          100: '#bbccee',
          200: '#99b2e6',
          300: '#7799dd',
          400: '#557fd5',
          500: '#3366CC',
          600: '#2a55aa',
          700: '#224488',
          800: '#193366',
          900: '#112244',
          950: '#081122',
        },
        
        // Dark Blue
        'dark-blue': {
          50: '#c0e2ff',
          100: '#81c6ff',
          200: '#42a9ff',
          300: '#038cff',
          400: '#006ac3',
          500: '#004884',
          600: '#003c6e',
          700: '#003058',
          800: '#002442',
          900: '#00182c',
          950: '#000c16',
        },
        
        // Red
        'red': {
          50: '#ffd3d3',
          100: '#ffa8a8',
          200: '#ff7c7c',
          300: '#ff5050',
          400: '#ff2525',
          500: '#F80000',
          600: '#cf0000',
          700: '#a50000',
          800: '#7c0000',
          900: '#530000',
          950: '#290000',
        },
        
        // Gray (personalizado)
        'gray': {
          50: '#ededed',
          100: '#dadada',
          200: '#c8c8c8',
          300: '#b5b5b5',
          400: '#a3a3a3',
          500: '#909090',
          600: '#787878',
          700: '#606060',
          800: '#484848',
          900: '#303030',
          950: '#181818',
        },
      },
      
      fontFamily: {
        'work-sans': ['Work Sans', 'sans-serif'],
      },
      
      fontSize: {
        'display-1': ['95.4px', { lineHeight: '1.1' }],
        'display-2': ['76.3px', { lineHeight: '1.1' }],
        'heading-1': ['61px', { lineHeight: '1.2' }],
        'heading-2': ['48.8px', { lineHeight: '1.2' }],
        'heading-3': ['39.1px', { lineHeight: '1.3' }],
        'heading-4': ['31.3px', { lineHeight: '1.3' }],
        'heading-5': ['25px', { lineHeight: '1.4' }],
        'heading-6': ['20px', { lineHeight: '1.4' }],
        'paragraph': ['16px', { lineHeight: '1.6' }],
        'small': ['12.8px', { lineHeight: '1.5' }],
      },
      
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'pattern': "url('../assets/bg.png')",
      },
      
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
} 