import React from 'react';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from '@/hooks/useColorScheme';
import DrawerContent from '@/components/navigation/DrawerContent';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { LocalizationProvider, useI18n } from '@/contexts/LocalizationProvider';

function AppDrawer({ theme, isDark }: { theme: any; isDark: boolean }) {
  const { t } = useI18n();
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'right',
        headerShown: true,
        headerTitle: t('appTitle'),
        headerTintColor: theme.colors.onSurface,
        headerStyle: { backgroundColor: theme.colors.surface },
        swipeEdgeWidth: 90,
        drawerType: 'slide'
      }}
      drawerContent={(props: any) => (
        <DrawerContent
          {...props}
          isDark={isDark}
        />
      )}
    >
      <Drawer.Screen name="index" options={{ title: t('home'), drawerIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} /> }} />
      <Drawer.Screen name="itineraries" options={{ title: t('itineraries'), drawerIcon: ({ color, size }) => <MaterialIcons name="route" size={size} color={color} /> }} />
      <Drawer.Screen name="settings" options={{ title: t('settings'), drawerIcon: ({ color, size }) => <MaterialIcons name="settings" size={size} color={color} /> }} />
      <Drawer.Screen name="+not-found" options={{ title: t('notFoundTitle'), drawerIcon: ({ color, size }) => <></> }} />
    </Drawer>
  );
}

export default function RootLayout() {
  const systemScheme = useColorScheme();
  const colorScheme = systemScheme ?? 'light';
  const isDark = colorScheme === 'dark';

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const base = isDark ? MD3DarkTheme : MD3LightTheme;
  const theme = React.useMemo(() => ({
    ...base,
    colors: {
      ...base.colors,
      primary: '#2f86a4ff',
      secondary: '#ffb300',
    },
  }), [base]);

  if (!loaded) return null;

  return (
    <PaperProvider theme={theme}>
      <LocalizationProvider>
        <AppDrawer theme={theme} isDark={isDark} />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </LocalizationProvider>
    </PaperProvider>
  );
}