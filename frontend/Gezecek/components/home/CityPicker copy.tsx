import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon } from '@/components/ui/icon';
import { Modal, ModalBackdrop, ModalContent } from '@/components/ui/modal';
import { SafeAreaView } from '@/components/ui/safe-area-view';
import { FlatList } from '@/components/ui/flat-list';
import { Text } from '@/components/ui/text';

import {
    View,
    Pressable,
    Keyboard,
    Platform,
    TextInput,
} from 'react-native';
import React from 'react';

type City = {
    name: string;
    country: string;
    subcountry?: string;
    geonameid?: string | number;
};

type CityPickerProps = {
    value: string;
    onChangeText: (text: string) => void;
    onSelect: (city: City) => void;
    placeholder?: string;
    mode?: 'origin' | 'destination';
    enforceSelection?: boolean;
    preferPlacement?: 'above' | 'below';
    restrictCountryCode?: string; // default 'TR'
    className?: string;
};

const CityPicker: React.FC<CityPickerProps> = ({
    value,
    onChangeText,
    onSelect,
    placeholder = 'Şehir seç',
    enforceSelection = false,
    // preferPlacement and mode not used with full-screen, kept for API compatibility
    preferPlacement,
    mode,
    restrictCountryCode = 'TR',
    className,
}) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const inputRef = React.useRef<TextInput | null>(null);
    const overlayInputRef = React.useRef<TextInput | null>(null);

    // Load cities once
    const allCities = React.useMemo<City[]>(() => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const data: City[] = require('cities.json');
            return restrictCountryCode
                ? data.filter((c) => c.country === restrictCountryCode)
                : data;
        } catch (e) {
            return [];
        }
    }, [restrictCountryCode]);

    const filtered = React.useMemo(() => {
        const q = value?.trim().toLowerCase() || '';
        if (!q) return allCities.slice(0, 30);
        return allCities
            .filter((c) => c.name.toLowerCase().includes(q) || c.subcountry?.toLowerCase().includes(q))
            .slice(0, 50);
    }, [value, allCities]);

    const open = () => {
        setIsOpen(true);
        // Delay focus to next tick so modal mounts first
        requestAnimationFrame(() => {
            overlayInputRef.current?.focus();
        });
    };

    const close = (enforce = enforceSelection) => {
        if (enforce) {
            const match = allCities.find(
                (c) => c.name.toLowerCase() === value.trim().toLowerCase()
            );
            if (!match) {
                onChangeText('');
            }
        }
        setIsOpen(false);
        Keyboard.dismiss();
    };

    const handleSelect = (city: City) => {
        onChangeText(city.name);
        onSelect?.(city);
        close(false);
    };

    const renderInlineInput = (
        <Input
            size={'lg'}
            variant={'rounded'}
            isInvalid={false}
            isDisabled={false}
            className={className}
        >
            <InputField
                ref={inputRef as any}
                onFocus={open}
                onChangeText={onChangeText as any}
                value={value}
                placeholder={placeholder}
                clearButtonMode="always"
            />
            <InputSlot className={`pr-4`}>
                <InputIcon as={SearchIcon} />
            </InputSlot>
        </Input>
    );

    return (
        <>
            {renderInlineInput}

            <Modal isOpen={isOpen} onClose={() => close(false)}>
                <ModalBackdrop onPress={() => close(false)} />
                <ModalContent className="rounded-none border-0 p-0 w-full h-full justify-start items-stretch">
                    <SafeAreaView style={{ flex: 1 }}>
                        {/* Top search bar */}
                        <View className="px-4 pb-3 pt-2 bg-background-0 border-b border-outline-100">
                            <Input size={'lg'} variant={'rounded'}>
                                <InputField
                                    ref={overlayInputRef as any}
                                    value={value}
                                    onChangeText={onChangeText as any}
                                    placeholder={placeholder}
                                    autoFocus
                                    clearButtonMode="always"
                                    returnKeyType="search"
                                />
                                <InputSlot className={`pr-4`}>
                                    <InputIcon as={SearchIcon} />
                                </InputSlot>
                            </Input>
                            {/* Close row */}
                            <View className="mt-2 flex-row justify-end">
                                <Pressable onPress={() => close(false)} accessibilityRole="button">
                                    <Text className="text-primary-600">Kapat</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* List */}
                        <FlatList
                            data={filtered}
                            keyExtractor={(item) => String(item.geonameid || item.name)}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => handleSelect(item)}
                                    className="px-4 py-3 border-b border-outline-100 active:bg-background-50"
                                >
                                    <Text className="text-base text-typography-900">{item.name}</Text>
                                    {item.subcountry ? (
                                        <Text className="text-sm text-typography-500">{item.subcountry}</Text>
                                    ) : null}
                                </Pressable>
                            )}
                            ListEmptyComponent={
                                <View className="px-4 py-6">
                                    <Text className="text-typography-600">Sonuç bulunamadı</Text>
                                </View>
                            }
                        />
                    </SafeAreaView>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CityPicker;