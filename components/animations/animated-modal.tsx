import React, { useEffect } from 'react';
import { Modal, ModalProps, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface AnimatedModalProps extends Omit<ModalProps, 'children'> {
  children: React.ReactNode;
  duration?: number;
}

/**
 * AnimatedModal - Modal component with slide-up entrance animation
 * Content slides up from bottom with fade effect
 */
export function AnimatedModal({
  visible,
  duration = 300,
  children,
  ...props
}: AnimatedModalProps) {
  const translateY = useSharedValue(500);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(1, {
        duration,
        easing: Easing.inOut(Easing.ease),
      });
    } else {
      translateY.value = withTiming(500, {
        duration: duration * 0.7,
        easing: Easing.inOut(Easing.ease),
      });
      opacity.value = withTiming(0, {
        duration: duration * 0.7,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [visible, duration, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="none" {...props}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <Animated.View
          style={[
            {
              flex: 1,
              justifyContent: 'flex-end',
            },
            animatedStyle,
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
