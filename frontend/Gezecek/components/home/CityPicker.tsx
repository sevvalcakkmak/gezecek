import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import { SearchIcon } from '@/components/ui/icon';
import React from 'react';

type CityPickerProps = {
    placeholder?: string;
}

const CityPicker: React.FC<CityPickerProps> = ({ placeholder }) => {

    const [value, setValue] = React.useState<string | undefined>('');
    const [isOpen, setIsOpen] = React.useState<boolean | undefined>(false);

    const onChangeText = (text: string) => {
        setValue(text);
    };

    const open = () => {
        setIsOpen(true);
    };

    const renderInlineInput = (
        <Input
            size={'lg'}
            variant={'rounded'}
            isInvalid={false}
            isDisabled={false}
        >
            <InputField
                onFocus={open}
                onChangeText={onChangeText}
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
        </>
    );
};

export default CityPicker;