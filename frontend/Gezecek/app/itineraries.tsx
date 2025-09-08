import { View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme, Text } from 'react-native-paper';

const itineraries = () => {
  const theme = useTheme();
  const { colors } = theme;
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text>Itineraries</Text>
    </View>
  )
}

export default itineraries