import React, { useEffect } from 'react';
import { ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface AnimatedCardProps extends ViewProps {
  index?: number;
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

/**
 * AnimatedCard - Card component with staggered fade-in animation
 * Each card animates in sequence with a slight delay
 */
export function AnimatedCard({
  index = 0,
  delay = 50,
  duration = 400,
  children,
  style,
  ...props
}: AnimatedCardProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const timer = setTimeout(() => {
      opacity.value = withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.ease),
      });
      translateY.value = withTiming(0, {
        duration,
        easing: Easing.inOut(Easing.ease),
      });
    }, index * delay);

    return () => clearTimeout(timer);
  }, [index, delay, duration, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
}
