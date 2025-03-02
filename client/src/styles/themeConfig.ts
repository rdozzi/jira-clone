interface Theme {
  colorPrimary: string;
  colorText: string;
  colorBgContainer: string;
  borderRadius: number;
  fontSize: number;
  fontFamily: string;
  primary: string;
  lightPrimary: string;
  darkPrimary: string;
  secondary: string;
  lightSecondary: string;
  darkSecondary: string;
  success: string;
  lightSuccess: string;
  darkSuccess: string;
  warning: string;
  lightWarning: string;
  darkWarning: string;
  error: string;
  lightError: string;
  darkError: string;
  infoLayer: string;
  intermediateContainer: string;
  background: string;
  textPrimary: string;
  textSecondary: string;
  h1: number;
  h2: number;
  h3: number;
  bodyText: number;
  smallText: number;
}

export const lightTheme: Theme = {
  colorPrimary: '#CCCDF7', //Indigo
  colorText: '#1F2937',
  colorBgContainer: '#FDFDFD',
  borderRadius: 8,
  fontSize: 16,
  fontFamily: "'Inter', sans-serif",

  primary: '#6366F1', //Indigo
  lightPrimary: '#CCCDF7',
  darkPrimary: '#4F52DD',
  secondary: '#D946EF', // Fuchsia
  lightSecondary: '#EFC3F6',
  darkSecondary: '#C532DB',
  success: '#10B981', // Green
  lightSuccess: '#B3E6D5',
  darkSuccess: '#00A56D',
  warning: '#FBBF24', // Yellow
  lightWarning: '#FAE8B9',
  darkWarning: '#E7AB10',
  error: '#F43F5E', // Red
  lightError: '#F2B7C4',
  darkError: '#CE0A35',
  infoLayer: '#FDFDFD',
  intermediateContainer: '#EFEFEF',
  background: '#D9D9D9',
  textPrimary: '#1F2937',
  textSecondary: '#333333',

  h1: 32,
  h2: 24,
  h3: 18,
  bodyText: 16,
  smallText: 12,
};

export const darkTheme: Theme = {
  colorPrimary: '#5154F0', //Indigo
  colorText: '#FDFDFD',
  colorBgContainer: '#323232',
  borderRadius: 8,
  fontSize: 16,
  fontFamily: "'Inter', sans-serif",

  primary: '#5154F0', //Indigo
  darkPrimary: '#2D2E5D',
  lightPrimary: ' #6568FF',
  secondary: '#B31CCA', // Fuchsia
  darkSecondary: '#4B1D52',
  lightSecondary: '#6568FF',
  success: '#067A53', // Green
  darkSuccess: '#173A2E',
  lightSuccess: '#1A8E67',
  warning: '#896406', // Yellow
  darkWarning: '#3E3317',
  lightWarning: '#9D781A',
  error: '#D7133E', // Red
  darkError: '#561B28',
  lightError: '#EB2752',
  infoLayer: '#323232',
  intermediateContainer: '#262626',
  background: '#1E1E1E',
  textPrimary: '#FDFDFD',
  textSecondary: '#EFEFEF',

  h1: 32,
  h2: 24,
  h3: 18,
  bodyText: 16,
  smallText: 12,
};
