interface Theme {
  token: {
    color: object;
    fontSize: object;
    borderRadius: number;
    fontFamily: string;
  };
}

export const lightTheme: Theme = {
  token: {
    color: {
      primary: '#6366F1', //Indigo
      lightPrimary: '#CCCDF7',
      darkPrimary: '#4F52DD',
      secondary: '#D946EF', // Fuchsia
      lightSecondary: '#EFC3F6',
      darkSecondary: '#C532DB',
      success: '#10B981', // Green
      lightSuccess: '#B3E6D5',
      warning: '#FBBF24', // Yellow
      lightWarning: '#FAE8B9',
      error: '#F43F5E', // Red
      lightError: '#F2B7C4',
      infoLayer: '#FDFDFD',
      intermediateContainer: '#EFEFEF',
      background: '#D9D9D9',
      textPrimary: '#1F2937',
      textSecondary: '#333333',
    },

    fontSize: {
      h1: 32,
      h2: 24,
      h3: 18,
      bodyText: 16,
      smallText: 12,
    },

    borderRadius: 8,
    fontFamily: "'Inter', sans-serif",
  },
};

export const darkTheme: Theme = {
  token: {
    color: {
      primary: '#5154F0', //Indigo
      darkPrimary: '#2D2E5D',
      lightPrimary: ' #6568FF',
      secondary: '#B31CCA', // Fuchsia
      darkSecondary: '#4B1D52',
      lightSecondary: '#6568FF',
      success: '#067A53', // Green
      darkSuccess: '#173A2E',
      warning: '#896406', // Yellow
      darkWarning: '#3E3317',
      error: '#D7133E', // Red
      darkError: '#561B28',
      infoLayer: '#323232',
      intermediateContainer: '#262626',
      background: '#1E1E1E',
      textPrimary: '#FDFDFD',
      textSecondary: '#EFEFEF',
    },

    fontSize: {
      h1: 32,
      h2: 24,
      h3: 18,
      bodyText: 16,
      smallText: 12,
    },

    borderRadius: 8,
    fontFamily: "'Inter', sans-serif",
  },
};
