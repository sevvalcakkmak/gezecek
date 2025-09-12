import React, { useMemo } from 'react';
import { Select, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectIcon, SelectInput, SelectItem, SelectPortal, SelectTrigger } from '../ui/select';
import { ChevronDownIcon } from '@/components/ui/icon';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '@/i18n';

const LanguagePicker = () => {
    const { t, i18n } = useTranslation();

    // Selected language first, then the rest
    const languages = useMemo(() => {
        const all = ['tr', 'en'] as const;
        return [i18n.language, ...all.filter((l) => l !== i18n.language)] as const;
    }, [i18n.language]);

    return (
        <>
            <Select
                // reflect selection and update i18n + storage on change
                selectedValue={i18n.language}
                onValueChange={async (value: string) => {
                    if (value && value !== i18n.language) {
                        await changeLanguage(value);
                    }
                }}
            >
                <SelectTrigger variant="outline" size="md" accessibilityLabel={t('changeLanguage')}>
                    <SelectInput value={t(`languages.${i18n.language}`)} />
                    <SelectIcon as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                        <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        {languages.map((lng) => (
                            <SelectItem key={lng} label={t(`languages.${lng}`)} value={lng} />
                        ))}
                    </SelectContent>
                </SelectPortal>
            </Select>
        </>
    );
};
export default LanguagePicker;