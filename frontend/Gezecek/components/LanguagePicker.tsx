import React from 'react';
import { View } from 'react-native';
import { useTheme, List } from 'react-native-paper';
import { useI18nMeta } from '@/contexts/LocalizationProvider';
import { useTranslation } from 'react-i18next';

// Basit dil seçici: Button'a basınca açılır, Menu.Item seçilince dili değiştirir
export const LanguagePicker: React.FC<{ mode?: 'menu' | 'list' }> = () => {
    const { lang, setLanguage } = useI18nMeta();
    const { t } = useTranslation();
    const theme = useTheme();

    const change = async (l: 'tr' | 'en') => {
        await setLanguage(l);
    };

    return (
        <View style={{ borderRadius: 12, overflow: 'hidden', backgroundColor: theme.colors.surfaceVariant }}>
            <List.Item
                title={`🇹🇷  ${t('turkish')}`}
                onPress={() => change('tr')}
                right={() => (lang === 'tr' ? <List.Icon icon="check" /> : null)}
            />
            <List.Item
                title={`🇺🇸  ${t('english')}`}
                onPress={() => change('en')}
                right={() => (lang === 'en' ? <List.Icon icon="check" /> : null)}
            />
        </View>
    );
};

export default LanguagePicker;
