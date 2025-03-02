import React, { ReactNode } from 'react';

import { ConfigProvider } from 'antd';

interface ConfigProviderComponentProps extends React.PropsWithChildren {
  themeTokens: object;
  lightTheme: { colorText: string; colorPrimary: string };
  darkTheme: { colorText: string; colorPrimary: string };
  modeTheme: 'light' | 'dark';
  children: React.ReactNode;
}

function ConfigProviderComponent({
  themeTokens,
  lightTheme,
  darkTheme,
  modeTheme,
  children,
}: ConfigProviderComponentProps) {
  return (
    <ConfigProvider
      theme={{
        token: { ...themeTokens },
        components: {
          Tabs: {
            itemColor:
              modeTheme === 'light'
                ? lightTheme.colorText
                : darkTheme.colorText,
            inkBarColor:
              modeTheme === 'light'
                ? lightTheme.colorPrimary
                : darkTheme.colorPrimary,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

export default ConfigProviderComponent;
