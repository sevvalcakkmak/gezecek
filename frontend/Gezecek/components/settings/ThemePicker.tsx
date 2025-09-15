import React, { useMemo } from 'react';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '../ui/select';
import { ChevronDownIcon } from '@/components/ui/icon';
import { useTranslation } from 'react-i18next';
import { useTheme, ThemeType } from '@/contexts/ThemeContext';

const ThemePicker = () => {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();

    // Available theme options
    const themeOptions: ThemeType[] = ['light', 'dark'];

    // Selected theme first, then the rest for better UX
    const orderedThemes = useMemo(() => {
        return [theme, ...themeOptions.filter((t) => t !== theme)];
    }, [theme]);

    const handleThemeChange = async (value: string) => {
        if (value && value !== theme && themeOptions.includes(value as ThemeType)) {
            try {
                await setTheme(value as ThemeType);
            } catch (error) {
                console.log('Theme change error:', error);
            }
        }
    };

    return (
        <Select
            selectedValue={theme}
            onValueChange={handleThemeChange}
        >
            <SelectTrigger variant="outline" size="md" accessibilityLabel={t('settingsPage.theme.title')}>
                <SelectInput value={t(`themes.${theme}`)} />
                <SelectIcon as={ChevronDownIcon} />
            </SelectTrigger>
            <SelectPortal>
                <SelectBackdrop />
                <SelectContent>
                    <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {orderedThemes.map((themeOption) => (
                        <SelectItem
                            key={themeOption}
                            label={t(`themes.${themeOption}`)}
                            value={themeOption}
                        />
                    ))}
                </SelectContent>
            </SelectPortal>
        </Select>
    );
};

export default ThemePicker;