import React from 'react';
import { Stack, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, Button, Appbar, Text, useTheme } from 'react-native-paper';

export default function NotFoundScreen() {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right', 'bottom']}>

        <Card mode="elevated">
          <Card.Content>
            <Text variant="titleLarge">Oops — This screen does not exist</Text>
            <Text variant="bodyMedium">
              The page you are looking for might have been removed or is temporarily unavailable. You can go back to the home page to continue.
            </Text>
          </Card.Content>

          <Card.Actions >
            <Button
              mode="contained"
              icon="home"
              onPress={() => router.push('/')}
              textColor={colors.onSurface}
            >
              Ana Sayfa
            </Button>
          </Card.Actions>
        </Card>
      </SafeAreaView>
    </>
  );
}