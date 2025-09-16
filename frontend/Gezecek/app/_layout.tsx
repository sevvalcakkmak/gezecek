import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import '@/global.css';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import { I18nextProvider } from 'react-i18next';
import i18n, { i18nReady } from '@/i18n';
import { ThemeProvider as CustomThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { ApiProvider } from '@/services';
import { GlobalApiErrorHandler } from '@/components/GlobalApiErrorHandler';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const [i18nLoaded, setI18nLoaded] = useState(false);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    i18nReady.finally(() => setI18nLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded && i18nLoaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, i18nLoaded]);
  if (!loaded || !i18nLoaded) return null;
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <I18nextProvider i18n={i18n}>
      <CustomThemeProvider>
        <ThemedApp />
      </CustomThemeProvider>
    </I18nextProvider>
  );
}

function ThemedApp() {
  const { resolvedTheme, isReady } = useTheme();

  // Don't render until theme is ready
  if (!isReady) {
    return null;
  }

  return (
    <ApiProvider>
      <GluestackUIProvider mode={resolvedTheme}>
        <ThemeProvider value={resolvedTheme === 'dark' ? DarkTheme : DefaultTheme}>
          <GlobalApiErrorHandler>
            <Slot />
          </GlobalApiErrorHandler>
        </ThemeProvider>
      </GluestackUIProvider>
    </ApiProvider>
  );
}
