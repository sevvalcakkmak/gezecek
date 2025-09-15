import { Grid, GridItem } from '@/components/ui/grid';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Divider } from '@/components/ui/divider';
import { Heading } from '../ui/heading';
import { useTranslation } from 'react-i18next';
import { Pressable } from '@/components/ui/pressable';
import { Box } from '../ui/box';
import { Icon } from '@/components/ui/icon';
import { CalendarDaysIcon } from '@/components/ui/icon';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Toast, ToastDescription, ToastTitle, useToast } from '../ui/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const DatePicker = () => {
    const { t, i18n } = useTranslation();
    const toast = useToast();
    const insets = useSafeAreaInsets();
    const dateFormat = i18n.language;

    const [toastId, setToastId] = React.useState<number>(0);
    const [isDatePickerOpen, setIsDatePickerOpen] = React.useState<boolean>(false);
    const [date, setDate] = React.useState<Date | null>(null);
    const [dateStrings, setDateStrings] = React.useState<{ dayString: string, monthString: string, yearString: string } | null>(null);

    const handleDatePress = () => {
        setIsDatePickerOpen(true);
    };

    const onDateChange = (event: DateTimePickerEvent, selectedDate: Date | undefined) => {
        setIsDatePickerOpen(false);

        if (!selectedDate || event?.type === 'dismissed') {
            return;
        }

        if (selectedDate < new Date()) {
            handleToast(t("datePicker.invalidDateTitle"), t("datePicker.invalidDateDescription"));
            return;
        }
        const dayString = selectedDate.toLocaleDateString(dateFormat, { day: 'numeric' });
        const monthString = selectedDate.toLocaleDateString(dateFormat, { month: 'short' });
        const yearString = selectedDate.toLocaleDateString(dateFormat, { year: '2-digit' });
        setDateStrings({ dayString, monthString, yearString });
        setDate(selectedDate);
    };

    const handleToast = (title: string, description: string) => {
        if (!toast.isActive(toastId.toString())) {
            showNewToast(title, description);
        }
    };

    const showNewToast = (title: string, description: string) => {
        const newId = Math.random();
        setToastId(newId);
        toast.show({
            id: newId.toString(),
            placement: 'top',
            duration: 4000,
            avoidKeyboard: true,
            render: ({ id }) => {
                const uniqueToastId = 'toast-' + id;
                return (
                    <Toast nativeID={uniqueToastId} action="error" variant="solid" style={{ marginTop: insets.top }}>
                        <ToastTitle>{title}</ToastTitle>
                        <ToastDescription>
                            {description}
                        </ToastDescription>
                    </Toast>
                );
            },
        });
    };


    const renderDate = () => {
        return (
            <Grid className="h-full" _extra={{
                className: 'grid-cols-16'
            }}>
                <GridItem className='flex items-center justify-center' _extra={{
                    className: 'col-span-11'
                }}>
                    <Heading size='xl' className='text-center'>{dateStrings?.dayString} {dateStrings?.monthString}</Heading>
                </GridItem>
                <GridItem className='flex items-center justify-center p-0' _extra={{
                    className: 'col-span-1'
                }}>
                    <Divider orientation='vertical' className='h-full w-1' />
                </GridItem>
                <GridItem className='flex items-center justify-center' _extra={{
                    className: 'col-span-4'
                }}>
                    <Heading size='lg' className='text-center'>{dateStrings?.yearString}</Heading>
                </GridItem>
            </Grid>
        );
    }

    const renderPlaceholder = () => {
        return (
            <Box className="h-full flex items-center justify-center">
                <HStack space="sm" className="items-center">
                    <Icon as={CalendarDaysIcon} size="xl" />
                    <VStack space="" className="items-center">
                        {t("datePicker.selectDate").split(' ').map((word, index) => (
                            <Text key={index} size='md'>{word}</Text>
                        ))}
                    </VStack>
                </HStack>
            </Box>
        );
    }

    return (
        <Pressable onPress={handleDatePress}>
            {isDatePickerOpen && <DateTimePicker
                value={date || new Date()}
                mode="date"
                display="calendar"
                onChange={onDateChange}
            />}
            <Card
                variant='outline'
                className='rounded-full w-full h-16 py-0 px-2 flex'
            >
                {date ? renderDate() : renderPlaceholder()}
            </Card>
        </Pressable>
    );
};
export default DatePicker;