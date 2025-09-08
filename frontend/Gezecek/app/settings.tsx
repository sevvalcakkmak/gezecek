import React from 'react';
import { ScrollView, View } from 'react-native';
import { useTheme, Surface, Text, Divider, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18nMeta } from '@/contexts/LocalizationProvider';
import { useTranslation } from 'react-i18next';
import LanguagePicker from '@/components/LanguagePicker';

export default function SettingsScreen() {
    const { colors } = useTheme();
    const { lang } = useI18nMeta();
    const { t } = useTranslation();

    return (
        <Surface style={{ flex: 1, backgroundColor: colors.background }}>
            <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    <Card mode="elevated" style={{ marginBottom: 20 }}>
                        <Card.Title title={t('changeLanguage')} />
                        <Divider />
                        <View style={{ padding: 16, gap: 12 }}>
                            <LanguagePicker mode='list' />
                        </View>
                    </Card>
                </ScrollView>
            </SafeAreaView>
        </Surface>
    );
}