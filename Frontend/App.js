import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import MainNavigator from './app/MainNavigator';
import LoginProvider, { useLogin } from './app/context/LoginProvider';

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0f172a',
    card: '#1e293b',
    text: '#ffffff',
    border: '#334155',
  },
};

const RootApp = () => {
  const { isDarkMode } = useLogin();
  return (
    <NavigationContainer theme={isDarkMode ? customDarkTheme : DefaultTheme}>
      <MainNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <LoginProvider>
      <RootApp />
    </LoginProvider>
  );
}