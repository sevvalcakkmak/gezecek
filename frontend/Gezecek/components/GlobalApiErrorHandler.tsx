import React from 'react';
import { Alert } from '@/components/ui/alert';
import { Button, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { View } from '@/components/ui/view';
import { useApiError, useApiState } from '@/services';

interface GlobalApiErrorHandlerProps {
    children: React.ReactNode;
}

export function GlobalApiErrorHandler({ children }: GlobalApiErrorHandlerProps) {
    const { error, clearError } = useApiError();
    const { isLoading } = useApiState();

    return (
        <>
            {children}

            {/* Global Error Display */}
            {error && (
                <View className="absolute bottom-0 left-0 right-0 p-4 z-50">
                    <Alert action="error" variant="solid" className="mb-4">
                        <Text className="font-semibold text-white mb-2">
                            API Error ({error.status})
                        </Text>
                        <Text className="text-white mb-3" size="sm">
                            {error.message}
                        </Text>
                        <Button
                            size="sm"
                            variant="outline"
                            action="secondary"
                            onPress={clearError}
                            className="self-start"
                        >
                            <ButtonText className="text-white">Dismiss</ButtonText>
                        </Button>
                    </Alert>
                </View>
            )}

            {/* Global Loading Indicator */}
            {isLoading && (
                <View className="absolute top-0 left-0 right-0 h-1 bg-transparent z-40">
                    <View className="h-full bg-blue-500 animate-pulse opacity-75" />
                </View>
            )}
        </>
    );
}