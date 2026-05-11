import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, S } from '../theme/theme';

interface StatBarProps {
  label: string;
  value: number;
  color: string;
  maxValue?: number;
  showValue?: boolean;
}

export const StatBar: React.FC<StatBarProps> = ({
  label, value, color, maxValue = 200, showValue = true
}) => {
  const pct = Math.min(100, (value / maxValue) * 100);
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.barWrap}>
        <View style={[S.barContainer, { flex: 1 }]}>
          <View style={[S.barFill, { width: `${pct}%`, backgroundColor: color }]} />
        </View>
      </View>
      {showValue && <Text style={[styles.statValue, { color }]}>{value}</Text>}
    </View>
  );
};

interface XpBarProps {
  xp: number;
  maxXp: number;
  level: number;
}

export const XpBar: React.FC<XpBarProps> = ({ xp, maxXp, level }) => {
  const pct = Math.min(100, (xp / maxXp) * 100);
  return (
    <View style={styles.xpWrap}>
      <View style={S.spaceBetween}>
        <Text style={styles.xpLabel}>EXP</Text>
        <Text style={styles.xpLabel}>{xp.toLocaleString()} / {maxXp.toLocaleString()}</Text>
      </View>
      <View style={[S.barContainer, { height: 8 }]}>
        <View style={[S.barFill, {
          width: `${pct}%`,
          backgroundColor: COLORS.xp,
          shadowColor: COLORS.xp,
        }]} />
      </View>
    </View>
  );
};

interface WaterOrbProps {
  waterMl: number;
  targetMl: number;
}

export const WaterOrb: React.FC<WaterOrbProps> = ({ waterMl, targetMl }) => {
  const pct = Math.min(100, (waterMl / targetMl) * 100);
  const glasses = Math.floor(waterMl / 300);
  const targetGlasses = Math.ceil(targetMl / 300);

  return (
    <View style={styles.orbContainer}>
      {/* Outer ring */}
      <View style={[styles.orbRing, { borderColor: pct >= 100 ? COLORS.success : COLORS.cyan }]}>
        {/* Fill simulation */}
        <View style={styles.orbFillBg}>
          <View style={[styles.orbFill, {
            height: `${pct}%`,
            backgroundColor: pct >= 100 ? COLORS.success : COLORS.blue,
          }]} />
        </View>
        {/* Text overlay */}
        <View style={styles.orbTextOverlay}>
          <Text style={styles.orbEmoji}>💧</Text>
          <Text style={styles.orbValue}>{(waterMl / 1000).toFixed(1)} L</Text>
          <Text style={styles.orbSub}>{glasses}/{targetGlasses} glasses</Text>
        </View>
      </View>
    </View>
  );
};

interface StreakBadgeProps {
  streak: number;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({ streak }) => (
  <View style={styles.streakBadge}>
    <Text style={styles.streakFlame}>🔥</Text>
    <Text style={styles.streakNum}>{streak}</Text>
    <Text style={styles.streakLabel}>DAY{streak === 1 ? '' : 'S'}</Text>
  </View>
);

interface CheckItemProps {
  label: string;
  done: boolean;
  onPress: () => void;
  xpReward?: number;
}

export const CheckItem: React.FC<CheckItemProps> = ({ label, done, onPress, xpReward }) => (
  <View style={[styles.checkItem, done && styles.checkItemDone]}>
    <Text style={[styles.checkBox, done && { color: COLORS.success }]}>{done ? '✓' : '□'}</Text>
    <Text style={[styles.checkLabel, done && styles.checkLabelDone]} onPress={done ? undefined : onPress}>
      {label}
    </Text>
    {!done && xpReward !== undefined && xpReward > 0 && (
      <Text style={styles.xpBadge}>+{xpReward} XP</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  // Stat bar
  statRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  statLabel: { color: COLORS.textSub, fontSize: 11, width: 90, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'Courier' },
  barWrap: { flex: 1, marginHorizontal: 8 },
  statValue: { fontSize: 14, fontFamily: 'Courier', width: 38, textAlign: 'right', fontWeight: '700' },

  // XP bar
  xpWrap: { marginVertical: 6 },
  xpLabel: { color: COLORS.xp, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', fontFamily: 'Courier' },

  // Water orb
  orbContainer: { alignItems: 'center', marginVertical: 12 },
  orbRing: {
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 2, overflow: 'hidden',
  },
  orbFillBg: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,50,100,0.2)',
    justifyContent: 'flex-end',
  },
  orbFill: { opacity: 0.6, borderRadius: 80 },
  orbTextOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center',
  },
  orbEmoji: { fontSize: 28, marginBottom: 2 },
  orbValue: { color: COLORS.cyan, fontSize: 22, fontFamily: 'Courier', fontWeight: '700' },
  orbSub: { color: COLORS.textSub, fontSize: 11, letterSpacing: 1.5 },

  // Streak
  streakBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,150,0,0.1)',
    borderWidth: 1, borderColor: 'rgba(255,150,0,0.3)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 4,
  },
  streakFlame: { fontSize: 18 },
  streakNum: { color: COLORS.warning, fontSize: 22, fontWeight: '700', fontFamily: 'Courier' },
  streakLabel: { color: COLORS.textSub, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },

  // Check item
  checkItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: COLORS.borderDim,
    gap: 10,
  },
  checkItemDone: { opacity: 0.6 },
  checkBox: { color: COLORS.cyanDim, fontSize: 16, fontFamily: 'Courier' },
  checkLabel: { flex: 1, color: COLORS.textPrimary, fontSize: 14 },
  checkLabelDone: { textDecorationLine: 'line-through', color: COLORS.textSub },
  xpBadge: { color: COLORS.xp, fontSize: 11, fontFamily: 'Courier', letterSpacing: 1 },
  doneBadge: { color: COLORS.success, fontSize: 14 },
});
