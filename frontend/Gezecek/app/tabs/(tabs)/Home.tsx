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
const Home = () => {
  const { t } = useTranslation();
  const [origin, setOrigin] = React.useState<City | null>(null);
  const [destination, setDestination] = React.useState<City | null>(null);
  const [swapAngle, setSwapAngle] = React.useState(90);
  const rotation = React.useRef(new Animated.Value(90)).current;
  React.useEffect(() => {
    Animated.timing(rotation, {
      toValue: swapAngle,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [swapAngle]);
  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
    extrapolate: 'extend',
  });
  const AnimatedButtonIcon = React.useMemo(() => Animated.createAnimatedComponent(ButtonIcon as any), []);
  const swap = () => {
    const tempOrigin = origin;
    setOrigin(destination);
    setDestination(tempOrigin);
    setSwapAngle((a) => a + 180);
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

    <GridItem className="p-6 justify-center" _extra={{
      className: 'col-span-8'
    }}>
      <Card size={"lg"} variant={"outline"}>
        <CityPicker
          placeholder={t("homePage.origin")}
          mode='origin'
          enforceSelection
          value={origin}
          onSelect={(city) => setOrigin(city)}
        />

        <Grid className="my-6 gap-5" _extra={{
          className: 'grid-cols-8'
        }}>
          <GridItem className="justify-center" _extra={{
            className: 'col-span-3'
          }}>
            <Divider />
          </GridItem>

          <GridItem className="justify-center" _extra={{ className: 'col-span-2' }}>
            <Button
              size='lg'
              action='primary'
              variant='solid'
              onPress={swap}
              className='rounded-full h-12 w-12 p-0 self-center'
              accessibilityLabel={t('homePage.swap')}
            >
              <AnimatedButtonIcon as={RepeatIcon} style={{ transform: [{ rotate: rotateInterpolate }] }} />
            </Button>
          </GridItem>

          <GridItem className="justify-center" _extra={{
            className: 'col-span-3'
          }}>
            <Divider />
          </GridItem>
        </Grid>

        <CityPicker
          placeholder={t("homePage.destination")}
          mode='destination'
          enforceSelection
          value={destination}
          onSelect={(city) => setDestination(city)}
        />
      </Card>
    </GridItem>

  </Grid>;
};
export default Home;