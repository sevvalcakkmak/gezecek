import React from 'react';
import { Surface, Drawer as PaperDrawer, useTheme, Divider } from 'react-native-paper';
import { View } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const DrawerContent: React.FC<DrawerContentComponentProps & { isDark?: boolean }> = (props) => {
    const theme = useTheme();
    const { colors } = theme;
    const { t } = useTranslation();

    return (
        <Surface style={{ flex: 1, backgroundColor: colors.surface }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
                <DrawerContentScrollView
                    contentContainerStyle={{ paddingTop: 0, paddingBottom: 8 }}
                    showsVerticalScrollIndicator={false}
                >
                    <PaperDrawer.Section style={{ backgroundColor: 'transparent', marginTop: 4 }}>
                        {props.state.routes.map((route, index) => {
                            if (route.name.toLowerCase().includes('sitemap') || route.name.startsWith('_') || route.name.startsWith('+') || route.name === 'settings') {
                                return null;
                            }
                            const focused = index === props.state.index;
                            const descriptor = props.descriptors[route.key];
                            // Dynamic page key translation with safe fallback
                            const pageKey = `pages.${route.name}` as const;
                            const translated = (t(pageKey as any) as string) || undefined;
                            const fallback = translated || descriptor.options.title || route.name;
                            /* route.name === 'index'
                                ? t('home')
                                : route.name === 'itineraries'
                                    ? t('itineraries')
                                    : descriptor.options.title || route.name; */
                            const label = descriptor.options.drawerLabel || fallback;
                            const activeBg = focused ? (colors.primaryContainer || colors.primary) : 'transparent';
                            return (
                                <View key={route.key} style={{ marginHorizontal: 6, borderRadius: 10, overflow: 'hidden', backgroundColor: activeBg }}>
                                    {focused && (
                                        <View style={{ position: 'absolute', right: 0, top: 8, bottom: 8, width: 4, borderTopLeftRadius: 2, borderBottomLeftRadius: 2, backgroundColor: colors.primary }} />
                                    )}
                                    <PaperDrawer.Item
                                        label={label as string}
                                        icon={descriptor.options.drawerIcon as any}
                                        active={focused}
                                        onPress={() => props.navigation.navigate(route.name)}
                                        rippleColor={colors.primary}
                                        style={{ backgroundColor: 'transparent' }}
                                    />
                                </View>
                            );
                        })}
                    </PaperDrawer.Section>
                </DrawerContentScrollView>
                <Divider style={{ marginHorizontal: 12, marginBottom: 4, opacity: 0.25 }} />
                <View style={{ paddingHorizontal: 4, paddingBottom: 8 }}>
                    {props.state.routes.map((route, index) => {
                        if (route.name !== 'settings') return null;
                        const focused = index === props.state.index;
                        const descriptor = props.descriptors[route.key];
                        const label = descriptor.options.drawerLabel || t('settings');
                        const activeBg = focused ? (colors.primaryContainer || colors.primary) : 'transparent';
                        return (
                            <View key={route.key} style={{ marginHorizontal: 6, borderRadius: 10, overflow: 'hidden', backgroundColor: activeBg }}>
                                {focused && (
                                    <View style={{ position: 'absolute', right: 0, top: 8, bottom: 8, width: 4, borderTopLeftRadius: 2, borderBottomLeftRadius: 2, backgroundColor: colors.primary }} />
                                )}
                                <PaperDrawer.Item
                                    label={label as string}
                                    icon={descriptor.options.drawerIcon as any}
                                    active={focused}
                                    onPress={() => props.navigation.navigate(route.name)}
                                    rippleColor={colors.primary}
                                    style={{ backgroundColor: 'transparent' }}
                                />
                            </View>
                        );
                    })}
                </View>
            </SafeAreaView>
        </Surface>
    );
};

export default DrawerContent;
