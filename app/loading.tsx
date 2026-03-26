import { View, ActivityIndicator } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoadingScreen() {
  const colors = useColors();

  return (
    <LinearGradient
      colors={[colors.background, colors.surface]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <View style={{ alignItems: 'center', gap: 16 }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    </LinearGradient>
  );
}
