import { alpha } from '@mui/material/styles';

const withAlphas = (color) => {
  return {
    ...color,
    alpha4: alpha(color.main, 0.04),
    alpha8: alpha(color.main, 0.08),
    alpha12: alpha(color.main, 0.12),
    alpha30: alpha(color.main, 0.30),
    alpha50: alpha(color.main, 0.50)
  };
};

export const neutral = {
  50: '#F8F9FA',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D2D6DB',
  400: '#9DA4AE',
  500: '#6C737F',
  600: '#4D5761',
  700: '#2F3746',
  800: '#1C2536',
  900: '#111927'
};

export const indigo = withAlphas({
  lightest: '#F5F7FF',
  light: '#EBEEFE',
  main: '#6366F1',
  dark: '#4338CA',
  darkest: '#312E81',
  contrastText: '#FFFFFF'
});

export const success = withAlphas({
  lightest: '#FFF1F2',
  light: '#FFCDD2',
  main: '#EF4444',
  darkest: '#991B1B',
  contrastText: 'FFFFFF'
});

export const info = withAlphas({
  lightest: '#FDF2F8',
  light: '#FBCFE8',
  main: '#DB2777',
  dark: '#BE185D',
  darkest: '#831843',
  contrastText: '#FFFFFF'
});

export const warning = withAlphas({
  lightest: '#FFF5EB',
  light: '#FED7AA',
  main: '#F97316',
  dark: '#EA580C',
  darkest: '#9A3412',
  contrastText: '#FFFFFF'
});

export const error = withAlphas({
  lightest: '#FFF5F5',
  light: '#FED7D7',
  main: '#E53E3E',
  dark: '#C53030',
  darkest: '#9B2C2C',
  contrastText: '#FFFFFF'
});
