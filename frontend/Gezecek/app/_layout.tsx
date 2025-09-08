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
      <Drawer
        screenOptions={{
          drawerPosition: 'right',
          headerShown: true,
          headerTitle: 'Gezecek',
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
        <Drawer.Screen name="index" options={{ title: 'Home', drawerIcon: ({ color, size }) => <MaterialIcons name="home" size={size} color={color} /> }} />
        <Drawer.Screen name="itineraries" options={{ title: 'Itineraries', drawerIcon: ({ color, size }) => <MaterialIcons name="route" size={size} color={color} /> }} />
        <Drawer.Screen name="+not-found" options={{ title: 'Not Found', drawerIcon: ({ color, size }) => <></> }} />
      </Drawer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </PaperProvider>
  );
}