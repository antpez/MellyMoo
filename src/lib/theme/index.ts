import { useColorScheme } from 'react-native';
import { MD3DarkTheme as PaperDarkTheme, MD3LightTheme as PaperLightTheme, PaperProvider } from 'react-native-paper';

export const lightTheme = {
  ...PaperLightTheme,
  colors: {
    ...PaperLightTheme.colors,
    primary: '#7A4CFF',
    secondary: '#FF6F61',
  },
};

export const darkTheme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: '#B69CFF',
    secondary: '#FF8A80',
  },
};

export function usePaperTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
}

export { PaperProvider };


