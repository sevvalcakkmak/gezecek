import { Grid, GridItem } from '@/components/ui/grid';
import React from 'react';
import LanguagePicker from '@/components/settings/LanguagePicker';
import { Heading } from '@/components/ui/heading';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';

const settings = () => {
    const { t, i18n } = useTranslation();

    return <Grid className="gap-5" _extra={{
        className: 'grid-cols-8'
    }}>
        <GridItem className="bg-background-200 p-6 rounded-md" _extra={{
            className: 'col-span-8'
        }}>
            <Heading size={'l'} className="mb-1">{t('settingsPage.language.title')}</Heading>
            <Text size={'sm'} className='mb-4'>{t('settingsPage.language.description')}</Text>
            <LanguagePicker />
        </GridItem>
    </Grid>;
};
export default settings;