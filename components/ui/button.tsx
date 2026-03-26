import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/use-colors';
import { useResponsive } from '@/hooks/use-responsive';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  onPress: () => void;
  children: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
}: ButtonProps) {
  const colors = useColors();
  const responsive = useResponsive();

  const styles = StyleSheet.create({
    container: {
      borderRadius: 12,
      overflow: 'hidden',
      alignSelf: fullWidth ? 'stretch' : 'flex-start',
    },
    button: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: size === 'sm' ? responsive.spacing.md : size === 'lg' ? responsive.spacing.lg : responsive.spacing.md,
      paddingVertical: size === 'sm' ? responsive.spacing.sm : size === 'lg' ? responsive.spacing.md : responsive.spacing.sm,
    },
    text: {
      fontSize: size === 'sm' ? responsive.fontSize.sm : size === 'lg' ? responsive.fontSize.lg : responsive.fontSize.base,
      fontWeight: '700',
    },
  });

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      opacity: disabled || loading ? 0.6 : 1,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.accent,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.accent,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: colors.error,
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...styles.text,
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return { ...baseStyle, color: '#fff' };
      case 'outline':
        return { ...baseStyle, color: colors.accent };
      case 'ghost':
        return { ...baseStyle, color: colors.foreground };
      default:
        return baseStyle;
    }
  };

  const buttonContent = (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[getButtonStyle(), style]}
    >
      <Text style={getTextStyle()}>
        {loading ? 'Carregando...' : children}
      </Text>
    </TouchableOpacity>
  );

  // Use gradient for primary and secondary
  if ((variant === 'primary' || variant === 'secondary') && !disabled) {
    const gradientColors: readonly [string, string] = variant === 'primary'
      ? [colors.accent, colors.secondary]
      : [colors.secondary, colors.accent];

    return (
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, fullWidth && { alignSelf: 'stretch' }]}
      >
        {buttonContent}
      </LinearGradient>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[getButtonStyle(), style, fullWidth && { alignSelf: 'stretch' }]}
    >
      <Text style={getTextStyle()}>
        {loading ? 'Carregando...' : children}
      </Text>
    </TouchableOpacity>
  );
}
