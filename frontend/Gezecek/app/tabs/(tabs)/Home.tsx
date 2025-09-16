

import { Button, ButtonText, ButtonSpinner, ButtonIcon } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Grid, GridItem } from '@/components/ui/grid';
import React from 'react';
import { useTranslation } from 'react-i18next';
import CityPicker, { City } from '@/components/home/CityPicker';
import { Divider } from '@/components/ui/divider';
import { RepeatIcon } from '@/components/ui/icon';
import { Animated } from 'react-native';
import DatePicker from '@/components/home/DatePicker';
import { Toast, ToastDescription, ToastTitle, useToast } from '@/components/ui/toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const Home = () => {
  const {
    t
  } = useTranslation();
  const [origin, setOrigin] = React.useState<City | null>(null);
  const [destination, setDestination] = React.useState<City | null>(null);

  const [originDate, setOriginDate] = React.useState<Date | null>(null);
  const [destinationDate, setDestinationDate] = React.useState<Date | null>(null);

  const insets = useSafeAreaInsets();
  const toast = useToast();
  const [toastId, setToastId] = React.useState<number>(0);
  const [swapAngle, setSwapAngle] = React.useState(90);
  const rotation = React.useRef(new Animated.Value(90)).current;
  React.useEffect(() => {
    Animated.timing(rotation, {
      toValue: swapAngle,
      duration: 250,
      useNativeDriver: true
    }).start();
  }, [swapAngle]);
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend'
  });
  const AnimatedButtonIcon = React.useMemo(() => Animated.createAnimatedComponent((ButtonIcon as any)), []);
  const swap = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
    setSwapAngle(a => a + 180);
  };

  const handleSearch = () => {
    if (!origin || !destination || !originDate || !destinationDate) {
      handleToast(t("homePage.incompleteSelectionTitle"), t("homePage.incompleteSelectionDescription"));
      return;
    }
    if (origin.id === destination.id) {
      handleToast(t("homePage.sameCityTitle"), t("homePage.sameCityDescription"));
      return;
    }
    if (originDate > destinationDate) {
      handleToast(t("homePage.invalidDateTitle"), t("homePage.invalidDateDescription"));
      return;
    }

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

  return <Grid className="gap-5" _extra={{
    className: 'grid-cols-8'
  }}>
    <GridItem className="p-6" _extra={{
      className: 'col-span-8'
    }}>
      <Card size={"lg"} variant={"filled"}>
        <Heading size="2xl" className='mb-1 text-center'>
          {t("homePage.getStarted")}
        </Heading>
        <Text size="sm" className='mb-1 text-center'>{t("homePage.intro")}</Text>
      </Card>
    </GridItem>

    <GridItem className=" px-6 justify-center" _extra={{
      className: 'col-span-8'
    }}>
      <Card size={"lg"} variant={"outline"}>
        <Grid className="my-6 gap-5" _extra={{
          className: 'grid-cols-8'
        }}>

          <GridItem className="justify-center" _extra={{
            className: 'col-span-5'
          }}>
            <CityPicker placeholder={t("homePage.origin")} mode='origin' enforceSelection value={origin} onSelect={city => setOrigin(city)} />
          </GridItem>

          <GridItem className="justify-center" _extra={{
            className: 'col-span-3'
          }}>
            <DatePicker value={originDate} onDateChange={setOriginDate} />
          </GridItem>


          <GridItem className="justify-center" _extra={{
            className: 'col-span-3'
          }}>
            <Divider />
          </GridItem>

          <GridItem className="justify-center" _extra={{
            className: 'col-span-2'
          }}>
            <Button size='lg' action='primary' variant='solid' onPress={swap} className='rounded-full h-12 w-12 p-0 self-center' accessibilityLabel={t('homePage.swap')}>
              <AnimatedButtonIcon as={RepeatIcon} style={{
                transform: [{
                  rotate: rotateInterpolate
                }]
              }} />
            </Button>
          </GridItem>

          <GridItem className="justify-center" _extra={{
            className: 'col-span-3'
          }}>
            <Divider />
          </GridItem>

          <GridItem className="justify-center" _extra={{
            className: 'col-span-5'
          }}>
            <CityPicker placeholder={t("homePage.destination")} mode='destination' enforceSelection value={destination} onSelect={city => setDestination(city)} />
          </GridItem>

          <GridItem className="justify-center" _extra={{
            className: 'col-span-3'
          }}>
            <DatePicker value={destinationDate} onDateChange={setDestinationDate} />
          </GridItem>

        </Grid>
      </Card>
    </GridItem>

    <GridItem className="justify-center items-center px-6 py-4" _extra={{
      className: 'col-span-8'
    }}>
      <Button className='w-2/3 max-w-xs justify-center items-center' action={"primary"} variant={"solid"} size={"xl"} onPress={handleSearch}>
        <ButtonText>{t("homePage.search")}</ButtonText>
      </Button>
    </GridItem>

  </Grid>;
};
export default Home;