import { Grid, GridItem } from '@/components/ui/grid';
import React from 'react';
import LanguagePicker from '@/components/settings/LanguagePicker';
import ThemePicker from '@/components/settings/ThemePicker';
import { Heading } from '@/components/ui/heading';
import { useTranslation } from 'react-i18next';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';

const Settings = () => {
    const { t, i18n } = useTranslation();

    return <Grid className="gap-5" _extra={{
        className: 'grid-cols-8'
    }}>
        <GridItem className=" px-6 mt-4 rounded-md" _extra={{
            className: 'col-span-8'
        }}>
            <Card variant={"outline"}>
                <Heading size={'l'} className="mb-1">{t('settingsPage.language.title')}</Heading>
                <Text size={'sm'} className='mb-4'>{t('settingsPage.language.description')}</Text>
                <LanguagePicker />
            </Card>
        </GridItem>
        <GridItem className=" px-6 rounded-md" _extra={{
            className: 'col-span-8'
        }}>
            <Card variant={"outline"}>
                <Heading size={'l'} className="mb-1">{t('settingsPage.theme.title')}</Heading>
                <Text size={'sm'} className='mb-4'>{t('settingsPage.theme.description')}</Text>
                <ThemePicker />
            </Card>
        </GridItem>
    </Grid>;
};
export default Settings;