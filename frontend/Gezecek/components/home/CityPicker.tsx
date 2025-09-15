import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon, ArrowLeftIcon, CloseIcon } from '@/components/ui/icon';
import { Modal, ModalBackdrop, ModalContent, ModalHeader, ModalCloseButton, ModalBody } from '@/components/ui/modal';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Badge, BadgeText } from '@/components/ui/badge';
import { ScrollView } from '@/components/ui/scroll-view';
import { Pressable } from '@/components/ui/pressable';
import { Divider } from '@/components/ui/divider';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Animated, FlatList, Pressable as RNPressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

let citiesRaw: any[] = [];
let citiesPromise: Promise<any[]> | null = null;

const loadCitiesData = async (): Promise<any[]> => {
    if (citiesPromise) return citiesPromise;

    citiesPromise = import('cities.json').then((module: any) => {
        const data = Array.isArray(module.default) ? module.default : Array.isArray(module) ? module : [];
        citiesRaw = data;
        return data;
    }).catch(() => {
        citiesRaw = [];
        return [];
    });

    return citiesPromise;
};

export interface City {
    id: string;
    name: string;
    country: string;
    subcountry: string;
    geonameid: number;
    lat?: string;
    lng?: string;
    admin1?: string;
    admin2?: string;
}

type CityPickerProps = {
    placeholder?: string;
    value?: City | null;
    onSelect?: (city: City) => void;
    mode?: 'origin' | 'destination';
    enforceSelection?: boolean;
}

const CityPicker: React.FC<CityPickerProps> = ({
    placeholder,
    value,
    onSelect,
    mode,
    enforceSelection = false
}) => {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [debouncedQuery, setDebouncedQuery] = React.useState('');
    const [isOpen, setIsOpen] = React.useState(false);
    const [recentSearches, setRecentSearches] = React.useState<City[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSearching, setIsSearching] = React.useState(false);
    const [allCities, setAllCities] = React.useState<City[]>([]);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    // Debounce search query to improve performance
    React.useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
            setIsSearching(false);
        }, 150);

        if (searchQuery.trim()) {
            setIsSearching(true);
        } else {
            setIsSearching(false);
        }

        return () => clearTimeout(timer);
    }, [searchQuery]);

    React.useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (allCities.length > 0) return;

            setIsLoading(true);
            try {
                const data = await loadCitiesData();
                if (isMounted) {
                    const enrichedCities = data
                        .filter((c: any) => {
                            return c && c.name && c.country && c.lat && c.lng;
                        })
                        .map((c: any, index: number) => ({
                            id: String(c.geonameid || `${c.name}-${c.country}-${c.lat}-${c.lng}`),
                            name: String(c.name || ''),
                            country: String(c.country || ''),
                            subcountry: String(c.subcountry || ''),
                            geonameid: c.geonameid ?? 0,
                            lat: c.lat,
                            lng: c.lng,
                            admin1: c.admin1,
                            admin2: c.admin2,
                        }));

                    // Deduplicate cities by name-country combination
                    const cityMap = new Map<string, City>();
                    enrichedCities.forEach(city => {
                        const key = `${city.name.toLowerCase()}-${city.country}`;
                        if (!cityMap.has(key)) {
                            cityMap.set(key, city);
                        } else {
                            // If duplicate, keep the one with higher geonameid (more important)
                            const existing = cityMap.get(key)!;
                            if (city.geonameid > existing.geonameid) {
                                cityMap.set(key, city);
                            }
                        }
                    });

                    const uniqueCities = Array.from(cityMap.values());
                    setAllCities(uniqueCities);
                }
            } catch (error) {
                if (isMounted) setAllCities([]);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    React.useEffect(() => {
        setRecentSearches([]);
    }, []);

    React.useEffect(() => {
        const backAction = () => {
            if (isOpen) {
                handleClose();
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [isOpen]);

    // Animate modal
    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: isOpen ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [isOpen, fadeAnim]);

    const handleOpen = () => {
        setIsOpen(true);
        setSearchQuery('');
    };

    const handleClose = () => {
        setIsOpen(false);
        setSearchQuery('');
    };

    const handleSelectCity = (city: City) => {
        onSelect?.(city);

        // Add to recent searches
        setRecentSearches(prev => {
            const filtered = prev.filter(c => c.id !== city.id);
            return [city, ...filtered].slice(0, 5); // Keep last 5
        });

        handleClose();
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
    };

    // Normalize text for searching (Turkish character support)
    const normalizeText = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c');
    };

    // Derive popular cities internally - Turkey first, then other countries
    const popular: City[] = React.useMemo(() => {
        if (allCities.length === 0) return [];

        // Define popular cities by country - ordered by preference
        const popularCitiesByCountry: { [key: string]: string[] } = {
            'TR': ['Istanbul', 'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana'],
            'US': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'],
            'GB': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 'Leeds'],
            'DE': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart'],
            'FR': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes']
        };

        // Priority order: Turkey first, then others
        const countryPriority = ['TR', 'US', 'GB', 'DE', 'FR'];

        const nameMap = new Map<string, City>();
        allCities.forEach(c => {
            if (c && c.name && typeof c.name === 'string') {
                // Try exact match first, then normalized match
                nameMap.set(c.name.toLowerCase(), c);
                nameMap.set(normalizeText(c.name), c);
            }
        });

        const picked: City[] = [];

        // Try to find popular cities by country priority
        for (const countryCode of countryPriority) {
            const popularNames = popularCitiesByCountry[countryCode] || [];
            for (const name of popularNames) {
                const found = nameMap.get(name.toLowerCase()) || nameMap.get(normalizeText(name));
                if (found && !picked.find(p => p.id === found.id)) {
                    picked.push(found);
                    if (picked.length >= 12) break; // Limit total popular cities
                }
            }
            if (picked.length >= 12) break;
        }

        // Fallback: if we couldn't resolve enough, take high-population cities
        if (picked.length < 12) {
            const extras = allCities
                .filter(city => city && city.name && !picked.find(p => p.id === city.id))
                .sort((a, b) => (b.geonameid || 0) - (a.geonameid || 0)) // Sort by geonameid (higher = more important)
                .slice(0, 12 - picked.length);

            picked.push(...extras);
        }

        return picked.slice(0, 12);
    }, [allCities]);

    const filteredCities = React.useMemo(() => {
        if (!debouncedQuery.trim() || allCities.length === 0) return [];

        const normalizedQuery = normalizeText(debouncedQuery);
        const results: City[] = [];
        const maxResults = 30;

        for (let i = 0; i < allCities.length && results.length < maxResults; i++) {
            const city = allCities[i];
            if (!city || !city.name) continue;

            const cityName = normalizeText(city.name);
            const cityCountry = normalizeText(city.country || '');

            if (cityName.includes(normalizedQuery) || cityCountry.includes(normalizedQuery)) {
                results.push(city);
            }
        }

        results.sort((a, b) => {
            const aName = normalizeText(a.name || '');
            const bName = normalizeText(b.name || '');

            const aExact = aName === normalizedQuery;
            const bExact = bName === normalizedQuery;
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            const aStarts = aName.startsWith(normalizedQuery);
            const bStarts = bName.startsWith(normalizedQuery);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            return aName.length - bName.length;
        });

        return results;
    }, [debouncedQuery, allCities]);

    const displayedPopular = React.useMemo(() => {
        return popular;
    }, [popular]);

    const renderInlineInput = (
        <RNPressable
            onPress={handleOpen}
            style={({ pressed }) => [
                {
                    opacity: pressed ? 0.8 : 1,
                    width: '100%',
                }
            ]}
        >
            <Input
                className='h-16'
                size={'xl'}
                variant={'rounded'}
                isInvalid={false}
                isDisabled={false}
                pointerEvents="none"
            >
                <InputField
                    editable={false}
                    pointerEvents="none"
                    value={value?.name || ''}
                    size={'xl'}
                    placeholder={placeholder || t('cityPicker.searchPlaceholder')}
                    className="font-bold"
                />
                <InputSlot className="pr-4" pointerEvents="none">
                    <InputIcon as={SearchIcon} />
                </InputSlot>
            </Input>
        </RNPressable>
    );

    const renderCityItem = ({ item: city }: { item: City }) => {
        const countryName = city.country;
        const locationText = city.subcountry ? `${city.subcountry}, ${countryName}` : countryName;

        return (
            <Pressable
                onPress={() => handleSelectCity(city)}
                className="mx-4 my-1 p-4 rounded-lg border border-outline-200 bg-background-0"
            >
                <VStack space="xs">
                    <Text size="lg" className="font-semibold text-typography-900">
                        {city.name}
                    </Text>
                    <Text size="sm" className="text-typography-500">
                        {locationText}
                    </Text>
                </VStack>
            </Pressable>
        );
    };

    const renderCityItemLegacy = (city: City) => {
        const countryName = city.country;
        const locationText = city.subcountry ? `${city.subcountry}, ${countryName}` : countryName;

        return (
            <Pressable
                key={city.id}
                onPress={() => handleSelectCity(city)}
                className="mx-4 my-1 p-4 rounded-lg border border-outline-200 bg-background-0"
            >
                <VStack space="xs">
                    <Text size="lg" className="font-semibold text-typography-900">
                        {city.name}
                    </Text>
                    <Text size="sm" className="text-typography-500">
                        {locationText}
                    </Text>
                </VStack>
            </Pressable>
        );
    };

    const renderPopularCityBadge = (city: City) => (
        <Pressable
            key={city.id}
            onPress={() => handleSelectCity(city)}
            className="mr-2 mb-2"
        >
            <Badge size="lg" variant="solid" action={city.country === 'TR' ? 'primary' : 'secondary'}>
                <BadgeText className="font-medium">
                    {city.name} {city.country !== 'TR' && `(${city.country})`}
                </BadgeText>
            </Badge>
        </Pressable>
    );

    return (
        <>
            {renderInlineInput}

            <Modal isOpen={isOpen} onClose={handleClose} size="full">
                <ModalBackdrop />
                <ModalContent className="flex-1 m-0" style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}>
                    <ModalHeader className="border-b border-outline-200 bg-background-0">
                        <HStack className="items-center justify-between w-full px-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onPress={handleClose}
                                action="secondary"
                                className='mb-1'
                            >
                                <ButtonIcon
                                    as={ArrowLeftIcon}
                                    size="lg"
                                />
                            </Button>
                            <Heading size='xl'>
                                {mode === 'origin' ? t('homePage.origin') : t('homePage.destination')}
                            </Heading>
                            <Button
                                variant="outline"
                                size="sm"
                                onPress={handleClose}
                                action="secondary"
                                className='mb-1'
                            >
                                <ButtonIcon
                                    as={CloseIcon}
                                    size="lg"
                                />
                            </Button>
                        </HStack>
                    </ModalHeader>

                    <VStack space="md" className="px-4 py-4">
                        <Input size="lg" variant="rounded">
                            <InputField
                                placeholder={t('cityPicker.searchPlaceholder')}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoFocus
                                className="font-bold"
                            />
                            <InputSlot className="pr-4">
                                <InputIcon as={SearchIcon} />
                            </InputSlot>
                        </Input>
                    </VStack>

                    <Divider />

                    <VStack className="flex-1">
                        {debouncedQuery.trim() ? (
                            isSearching || isLoading ? (
                                <VStack className="px-6 py-12 items-center justify-center flex-1">
                                    <Text className="text-center text-typography-600 text-lg">
                                        {t('cityPicker.loading')}
                                    </Text>
                                </VStack>
                            ) : filteredCities.length > 0 ? (
                                <FlatList
                                    data={filteredCities}
                                    renderItem={renderCityItem}
                                    keyExtractor={(item) => item.id}
                                    maxToRenderPerBatch={10}
                                    windowSize={10}
                                    removeClippedSubviews={true}
                                    showsVerticalScrollIndicator={false}
                                    className='mt-2'
                                />
                            ) : (
                                <VStack className="px-6 py-12 items-center justify-center flex-1">
                                    <Text className="text-center text-typography-600 text-lg">
                                        {t('cityPicker.noResults')}
                                    </Text>
                                </VStack>
                            )
                        ) : (
                            <FlatList
                                data={[
                                    ...displayedPopular,
                                    ...allCities
                                        .filter(city =>
                                            !displayedPopular.find(pop => pop.id === city.id)
                                        )
                                        .slice(0, 100)
                                ]}
                                renderItem={renderCityItem}
                                keyExtractor={(item) => item.id}
                                maxToRenderPerBatch={10}
                                windowSize={10}
                                removeClippedSubviews={true}
                                ListHeaderComponent={() => (
                                    <VStack>
                                        <VStack className="px-6 py-4">
                                            <Text className="text-sm font-semibold mb-3 text-typography-600 uppercase tracking-wide">
                                                {t('cityPicker.popular')}
                                            </Text>
                                            <HStack className="flex-wrap gap-2">
                                                {displayedPopular.slice(0, 6).map(renderPopularCityBadge)}
                                            </HStack>
                                        </VStack>

                                        <Divider className="mb-2" />

                                        {recentSearches.length > 0 && (
                                            <>
                                                <HStack className="px-6 py-4 justify-between items-center">
                                                    <Text className="text-sm font-semibold text-typography-600 uppercase tracking-wide">
                                                        {t('cityPicker.recent')}
                                                    </Text>
                                                    <Button
                                                        variant="link"
                                                        size="xs"
                                                        onPress={clearRecentSearches}
                                                        action="primary"
                                                    >
                                                        <ButtonText>
                                                            {t('cityPicker.clearRecent')}
                                                        </ButtonText>
                                                    </Button>
                                                </HStack>
                                                <VStack>
                                                    {recentSearches.map(renderCityItemLegacy)}
                                                </VStack>
                                                <Divider className="my-2" />
                                            </>
                                        )}
                                    </VStack>
                                )}
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </VStack>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CityPicker;