import React from 'react';
import { ScrollView } from 'react-native';
import {
  Appbar,
  useTheme
} from 'react-native-paper';
import { router } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['left', 'right', 'bottom']}>

        <ScrollView contentContainerStyle={{ padding: 16 }}>
        </ScrollView>

      </SafeAreaView>
    </SafeAreaProvider>
  );
}