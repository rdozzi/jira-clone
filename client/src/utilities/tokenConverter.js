//Input token information manually and print in terminal

function tokenConverter(token) {
  const finalToken = {};

  //Build the object
  for (let i = 0; i < token.length; i++) {
    const key = i === 0 ? 50 : i * 100;
    finalToken[key] = `"${token[i]['hex']}", //${token[i]['token']}`;
  }

  for (const [key, value] of Object.entries(finalToken)) {
    console.log(`${key}: ${value}`);
  }
  return finalToken;
}

const token = [
  {
    hex: '#feecef',
    rgb: 'rgb(254, 236, 239)',
    token: 'redLight',
  },
  {
    hex: '#fde2e7',
    rgb: 'rgb(253, 226, 231)',
    token: 'redLightHover',
  },
  {
    hex: '#fcc3cd',
    rgb: 'rgb(252, 195, 205)',
    token: 'redLightActive',
  },
  {
    hex: '#f43f5e',
    rgb: 'rgb(244, 63, 94)',
    token: 'redNormal',
  },
  {
    hex: '#dc3955',
    rgb: 'rgb(220, 57, 85)',
    token: 'redNormalHover',
  },
  {
    hex: '#c3324b',
    rgb: 'rgb(195, 50, 75)',
    token: 'redNormalActive',
  },
  {
    hex: '#b72f47',
    rgb: 'rgb(183, 47, 71)',
    token: 'redDark',
  },
  {
    hex: '#922638',
    rgb: 'rgb(146, 38, 56)',
    token: 'redDarkHover',
  },
  {
    hex: '#6e1c2a',
    rgb: 'rgb(110, 28, 42)',
    token: 'redDarkActive',
  },
  {
    hex: '#551621',
    rgb: 'rgb(85, 22, 33)',
    token: 'redDarker',
  },
];

tokenConverter(token);
