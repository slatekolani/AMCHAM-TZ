import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                display: ['"Source Serif 4"', 'Georgia', ...defaultTheme.fontFamily.serif],
            },
            colors: {
                navy: {
                    50: '#F4F7FB',
                    100: '#E8EEF7',
                    200: '#C8D6EA',
                    300: '#9FB6D8',
                    400: '#6788BB',
                    500: '#3B5E97',
                    600: '#24457C',
                    700: '#173463',
                    800: '#0F2148',
                    900: '#0B1730',
                    950: '#060D1D',
                },
                crimson: {
                    DEFAULT: '#C8102E',
                    50: '#FDF2F4',
                    600: '#AD0E28',
                    700: '#8F0B21',
                },
                gold: {
                    DEFAULT: '#C9A227',
                    600: '#A98620',
                },
                mist: '#F6F8FB',
                line: '#E4E9F1',
                ink: {
                    DEFAULT: '#182338',
                    muted: '#4A576D',
                    faint: '#7C8AA0',
                },
            },
            boxShadow: {
                card: '0 1px 2px rgba(11, 23, 48, 0.05), 0 10px 30px -14px rgba(11, 23, 48, 0.14)',
                'card-lg': '0 2px 4px rgba(11, 23, 48, 0.06), 0 24px 48px -18px rgba(11, 23, 48, 0.22)',
                header: '0 1px 0 rgba(11, 23, 48, 0.06), 0 10px 30px -18px rgba(11, 23, 48, 0.25)',
            },
            maxWidth: {
                shell: '76rem',
            },
            letterSpacing: {
                caps: '0.18em',
            },
            keyframes: {
                'fade-up': {
                    from: { opacity: '0', transform: 'translateY(24px)' },
                    to: { opacity: '1', transform: 'translateY(0)' },
                },
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'slow-zoom': {
                    from: { transform: 'scale(1)' },
                    to: { transform: 'scale(1.08)' },
                },
                'hero-progress': {
                    from: { transform: 'scaleX(0)' },
                    to: { transform: 'scaleX(1)' },
                },
            },
            animation: {
                'fade-up': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
                'fade-up-delay-1': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both',
                'fade-up-delay-2': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.24s both',
                'fade-up-delay-3': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.36s both',
                'fade-in': 'fade-in 1.2s ease both',
                'slow-zoom': 'slow-zoom 18s ease-out both',
                'hero-progress': 'hero-progress 6.5s linear both',
            },
        },
    },

    plugins: [forms],
};
