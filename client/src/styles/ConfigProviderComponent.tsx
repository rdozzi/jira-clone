import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { darkTheme, lightTheme } from './themeConfig';

interface Props {
  modeTheme: 'light' | 'dark';
  children: React.ReactNode;
}

function ConfigProviderComponent({ modeTheme, children }: Props) {
  const selectedTheme = modeTheme === 'light' ? lightTheme : darkTheme;
  return (
    <ConfigProvider
      theme={{
        algorithm:
          modeTheme === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
        token: selectedTheme.token,
        components: {
          Layout: {
            headerBg: selectedTheme.layout.headerBg,
            siderBg: selectedTheme.layout.siderBg,
            bodyBg: selectedTheme.layout.bodyBg,
          },
          Button: {
            colorText: selectedTheme.token.colorText,
            defaultColor: selectedTheme.token.colorText,
            defaultHoverColor: selectedTheme.token.colorPrimary,
          },
        },
      }}
    >
      <style>
        {`
      :root {
        --border-color: ${selectedTheme.token.colorBorder};
      }
    `}
      </style>
      {children}
    </ConfigProvider>
  );
}

export default ConfigProviderComponent;
