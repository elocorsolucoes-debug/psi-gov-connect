import React, { useEffect } from 'react';
import { View, ViewProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export type AnimationType = 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'slideInUp' | 'slideInDown';

interface AnimatedScreenProps extends ViewProps {
  animation?: AnimationType;
  duration?: number;
  delay?: number;
  children: React.ReactNode;
}

/**
 * AnimatedScreen - Wrapper component that applies entrance animations to screens
 * Supports fade, slide-left, slide-right, slide-up, slide-down animations
 */
export function AnimatedScreen({
  animation = 'fadeIn',
  duration = 400,
  delay = 0,
  children,
  style,
  ...props
}: AnimatedScreenProps) {
  const opacity = useSharedValue(animation === 'fadeIn' ? 0 : 1);
  const translateX = useSharedValue(
    animation === 'slideInLeft' ? -100 : animation === 'slideInRight' ? 100 : 0
  );
  const translateY = useSharedValue(
    animation === 'slideInUp' ? 100 : animation === 'slideInDown' ? -100 : 0
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (animation === 'fadeIn') {
        opacity.value = withTiming(1, {
          duration,
          easing: Easing.inOut(Easing.ease),
        });
      } else if (animation.startsWith('slideIn')) {
        if (animation === 'slideInLeft' || animation === 'slideInRight') {
          translateX.value = withTiming(0, {
            duration,
            easing: Easing.inOut(Easing.ease),
          });
        } else {
          translateY.value = withTiming(0, {
            duration,
            easing: Easing.inOut(Easing.ease),
          });
        }
        opacity.value = withTiming(1, {
          duration,
          easing: Easing.inOut(Easing.ease),
        });
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [animation, duration, delay, opacity, translateX, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <Animated.View style={[animatedStyle, style]} {...props}>
      {children}
    </Animated.View>
  );
}
