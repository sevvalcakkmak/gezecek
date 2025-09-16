import React from 'react';
import { Modal, ModalBackdrop, ModalContent, ModalBody } from '@/components/ui/modal';
import { View } from '@/components/ui/view';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Spinner } from '@/components/ui/spinner';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { useTranslation } from 'react-i18next';
import { Animated, Dimensions } from 'react-native';
import { Icon, CheckIcon, CloseIcon } from '@/components/ui/icon';

export interface SearchStep {
    id: string;
    labelKey: string;
    status: 'pending' | 'searching' | 'completed' | 'failed';
}

interface SearchModalProps {
    isVisible: boolean;
    onClose: () => void;
    steps: SearchStep[];
    overallProgress: number;
    title?: string;
}

const SearchModal: React.FC<SearchModalProps> = ({
    isVisible,
    onClose,
    steps,
    overallProgress,
    title
}) => {
    const { t } = useTranslation();

    // Animation values for each step
    const [stepAnimations] = React.useState(() =>
        steps.reduce((acc, step) => {
            acc[step.id] = new Animated.Value(0);
            return acc;
        }, {} as Record<string, Animated.Value>)
    );

    // Animate steps when status changes
    React.useEffect(() => {
        steps.forEach((step) => {
            if (step.status === 'searching') {
                // Daha uzun ve belirgin animasyon
                Animated.timing(stepAnimations[step.id], {
                    toValue: 1,
                    duration: 600, // 300ms → 600ms
                    useNativeDriver: true,
                }).start();
            } else if (step.status === 'completed' || step.status === 'failed') {
                // Bounce efekti ekleyelim
                Animated.sequence([
                    Animated.timing(stepAnimations[step.id], {
                        toValue: 1.2, // Önce daha büyük
                        duration: 150,
                        useNativeDriver: true,
                    }),
                    Animated.timing(stepAnimations[step.id], {
                        toValue: 0, // Sonra normale
                        duration: 200,
                        useNativeDriver: true,
                    })
                ]).start();
            }
        });
    }, [steps, stepAnimations]);

    const renderStepIcon = (step: SearchStep) => {
        const scale = stepAnimations[step.id].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.3], // Daha belirgin scale: %30 büyüme
        });

        const opacity = stepAnimations[step.id].interpolate({
            inputRange: [0, 1],
            outputRange: [0.7, 1], // Opacity da değişsin
        });

        const rotate = stepAnimations[step.id].interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'], // 360 derece dönme ekledik
        });

        switch (step.status) {
            case 'searching':
                return (
                    <Animated.View style={{
                        transform: [{ scale }, { rotate }],
                        opacity
                    }}>
                        <Spinner size="small" className="text-primary-500" />
                    </Animated.View>
                );
            case 'completed':
                return (
                    <Animated.View style={{
                        transform: [{ scale: scale }],
                        opacity
                    }}>
                        <Icon as={CheckIcon} size="lg" className="text-success-500" />
                    </Animated.View>
                );
            case 'failed':
                return (
                    <Animated.View style={{
                        transform: [{ scale: scale }],
                        opacity
                    }}>
                        <Icon as={CloseIcon} size="lg" className="text-error-500" />
                    </Animated.View>
                );
            case 'pending':
            default:
                return (
                    <View className="w-5 h-5 rounded-full border-2 border-background-400 opacity-60" />
                );
        }
    };

    const getStepTextColor = (status: SearchStep['status']) => {
        switch (status) {
            case 'searching':
                return 'text-primary-600';
            case 'completed':
                return 'text-success-600';
            case 'failed':
                return 'text-error-600';
            default:
                return 'text-typography-500';
        }
    };

    return (
        <Modal isOpen={isVisible} onClose={onClose} size="md">
            <ModalBackdrop className="bg-background-200/90" />
            <ModalContent className="bg-background-0 mx-4 my-auto shadow-lg">
                <ModalBody className="p-6">
                    <VStack space="lg">
                        <VStack space="sm" className="items-center">
                            <Heading size="lg" className="text-center text-typography-900">
                                {title || t('searchModal.title')}
                            </Heading>
                            <Text size="sm" className="text-typography-500 text-center">
                                {t('searchModal.subtitle')}
                            </Text>
                        </VStack>

                        <VStack space="xs">
                            <HStack className="justify-between">
                                <Text size="xs" className="text-typography-400 font-medium">
                                    {t('searchModal.progress')}
                                </Text>
                                <Text size="xs" className="text-typography-400 font-medium">
                                    {Math.round(overallProgress)}%
                                </Text>
                            </HStack>
                            <Progress value={overallProgress} size="sm" className="w-full bg-background-200">
                                <ProgressFilledTrack className="bg-primary-500 transition-all duration-500 ease-out" />
                            </Progress>
                        </VStack>

                        <VStack space="md" className="min-h-32">
                            {steps.map((step, index) => {
                                const rowScale = stepAnimations[step.id].interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 1.02],
                                });

                                const backgroundColor = step.status === 'searching'
                                    ? 'rgba(59, 130, 246, 0.1)'
                                    : 'transparent';

                                return (
                                    <Animated.View
                                        key={step.id}
                                        style={{
                                            transform: [{ scale: rowScale }],
                                            backgroundColor,
                                            borderRadius: 8,
                                            padding: 8,
                                            marginHorizontal: -8,
                                        }}
                                    >
                                        <HStack space="md" className="items-center">
                                            <View className="w-8 h-8 items-center justify-center">
                                                {renderStepIcon(step)}
                                            </View>

                                            <Text
                                                size="md"
                                                className={`flex-1 ${getStepTextColor(step.status)} font-medium transition-colors duration-300`}
                                            >
                                                {t(step.labelKey)}
                                            </Text>

                                            <View className="w-16 items-end">
                                                {step.status === 'searching' && (
                                                    <Text size="xs" className="text-primary-500 font-medium animate-pulse">
                                                        {t('searchModal.searching')}
                                                    </Text>
                                                )}
                                                {step.status === 'completed' && (
                                                    <Text size="xs" className="text-success-500 font-medium">
                                                        {t('searchModal.found')}
                                                    </Text>
                                                )}
                                                {step.status === 'failed' && (
                                                    <Text size="xs" className="text-error-500 font-medium">
                                                        {t('searchModal.failed')}
                                                    </Text>
                                                )}
                                            </View>
                                        </HStack>
                                    </Animated.View>
                                );
                            })}
                        </VStack>

                        <View className="pt-3 border-t border-background-200">
                            <Text size="xs" className="text-typography-400 text-center opacity-75">
                                {t('searchModal.footerInfo')}
                            </Text>
                        </View>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SearchModal;