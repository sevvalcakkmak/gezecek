import React from 'react';
import { Surface, Drawer as PaperDrawer, Text, useTheme, Divider, Switch, Avatar } from 'react-native-paper';
import { View } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';

const DrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const theme = useTheme();
    const { colors } = theme;
    const dark = (theme as any).dark === true;

    return (
        <Surface style={{ flex: 1, backgroundColor: colors.surface }}>
            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
                <DrawerContentScrollView
                    contentContainerStyle={{ paddingTop: 0, paddingBottom: 8 }}
                    showsVerticalScrollIndicator={false}
                >
                    <PaperDrawer.Section style={{ backgroundColor: 'transparent', marginTop: 4 }}>
                        {props.state.routes.map((route, index) => {
                            if (route.name.toLowerCase().includes('sitemap') || route.name.startsWith('_')) {
                                return null;
                            }
                            const focused = index === props.state.index;
                            const descriptor = props.descriptors[route.key];
                            const label = descriptor.options.drawerLabel || descriptor.options.title || route.name;
                            const activeBg = focused ? colors.primary : 'transparent';
                            return (
                                <View key={route.key} style={{ marginHorizontal: 4, borderRadius: 10, overflow: 'hidden', backgroundColor: activeBg }}>
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
            </SafeAreaView>
        </Surface>
    );
};

export default DrawerContent;
