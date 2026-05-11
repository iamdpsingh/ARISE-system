import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions } from 'react-native';
import { COLORS, FONTS } from '../theme/theme';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  type?: 'levelup' | 'quest' | 'penalty' | 'system' | 'warning';
  onDismiss?: () => void;
}

const SystemAlert: React.FC<Props> = ({ visible, title, message, type = 'system', onDismiss }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      ]).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0.3, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 0.8, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const colorMap = {
    levelup: COLORS.xp,
    quest: COLORS.success,
    penalty: COLORS.danger,
    system: COLORS.cyan,
    warning: COLORS.warning,
  };
  const borderColor = colorMap[type];

  return (
    <View style={styles.overlay} pointerEvents={visible ? 'auto' : 'none'}>
      <Animated.View style={[styles.container, { opacity, transform: [{ scale }], borderColor }]}>
        {/* Top Divider */}
        <View style={[styles.topLine, { backgroundColor: borderColor }]} />

        {/* Header tag */}
        <Text style={[styles.tag, { color: borderColor }]}>
          {'[[ SYSTEM MESSAGE ]]'}
        </Text>

        {/* Title */}
        <Text style={[styles.title, { color: borderColor }]}>{title}</Text>

        {/* Message */}
        <Text style={styles.message}>{message}</Text>

        {/* Dismiss */}
        {onDismiss && (
          <Text style={[styles.dismiss, { color: borderColor }]} onPress={onDismiss}>
            {'[ ACKNOWLEDGE ]'}
          </Text>
        )}

        {/* Bottom line */}
        <View style={[styles.topLine, { backgroundColor: borderColor, marginTop: 12 }]} />
      </Animated.View>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2, 3, 8, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  container: {
    width: width * 0.85,
    borderWidth: 1.5,
    backgroundColor: 'rgba(0,10,30,0.97)',
    padding: 24,
    alignItems: 'center',
  },
  topLine: {
    height: 2,
    width: '100%',
    marginBottom: 12,
  },
  tag: {
    ...FONTS.mono,
    fontSize: 10,
    marginBottom: 12,
    letterSpacing: 3,
  },
  title: {
    ...FONTS.title,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  dismiss: {
    ...FONTS.system,
    fontSize: 13,
    letterSpacing: 4,
  },
});

export default SystemAlert;
