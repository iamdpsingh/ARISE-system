// ============================================================
// ARISE: The System — Design System / Theme
// ============================================================

import { StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const COLORS = {
  // Backgrounds
  bg: '#05070a',
  bgDeep: '#020305',
  bgPanel: 'rgba(0, 15, 45, 0.85)',
  bgCard: 'rgba(0, 20, 55, 0.6)',

  // Neon accents
  cyan: '#00f3ff',
  cyanDim: '#0099aa',
  cyanGlow: 'rgba(0, 243, 255, 0.3)',
  blue: '#004de6',
  blueBright: '#1a6fff',
  purple: '#6c00ff',

  // Status colors
  hp: '#ff3e3e',
  hpGlow: 'rgba(255, 62, 62, 0.3)',
  mp: '#4488ff',
  mpGlow: 'rgba(68, 136, 255, 0.3)',
  xp: '#f0c040',
  xpGlow: 'rgba(240, 192, 64, 0.3)',

  // Rankings
  rankE: '#aaaaaa',
  rankD: '#44ccff',
  rankC: '#44ff88',
  rankB: '#ff9900',
  rankA: '#ff4444',
  rankS: '#aa44ff',
  rankNational: '#ffcc00',
  rankMonarch: '#00f3ff',

  // Text
  textPrimary: '#e0f0ff',
  textSub: '#668899',
  textDim: 'rgba(200,230,255,0.3)',
  textNeon: '#00f3ff',

  // Alerts
  success: '#00ff88',
  warning: '#ffaa00',
  danger: '#ff3333',

  // Border
  borderNeon: 'rgba(0, 243, 255, 0.3)',
  borderDim: 'rgba(0, 120, 180, 0.15)',
};

export const FONTS = {
  title: {
    fontFamily: 'System',
    letterSpacing: 3,
    textTransform: 'uppercase' as const,
    fontWeight: '700' as const,
  },
  system: {
    fontFamily: 'System',
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    fontWeight: '500' as const,
  },
  body: {
    fontFamily: 'System',
    letterSpacing: 0.5,
    fontWeight: '400' as const,
  },
  mono: {
    fontFamily: 'Courier',
    letterSpacing: 1,
  },
};

export const RANK_COLORS: Record<string, string> = {
  'E': COLORS.rankE,
  'D': COLORS.rankD,
  'C': COLORS.rankC,
  'B': COLORS.rankB,
  'A': COLORS.rankA,
  'S': COLORS.rankS,
  'National': COLORS.rankNational,
  'Shadow Monarch': COLORS.rankMonarch,
};

export const S = StyleSheet.create({
  // Layout
  screen: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Panels (glassmorphism-style)
  panel: {
    backgroundColor: COLORS.bgPanel,
    borderWidth: 1,
    borderColor: COLORS.borderNeon,
    borderRadius: 4,
    padding: 16,
    marginVertical: 6,
  },
  panelSmall: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.borderDim,
    borderRadius: 4,
    padding: 12,
    marginVertical: 4,
  },

  // Typography
  titleText: {
    ...FONTS.title,
    color: COLORS.cyan,
    fontSize: 22,
  },
  sectionTitle: {
    ...FONTS.system,
    color: COLORS.cyan,
    fontSize: 12,
    marginBottom: 8,
  },
  neonText: {
    ...FONTS.system,
    color: COLORS.cyan,
    fontSize: 14,
  },
  bodyText: {
    ...FONTS.body,
    color: COLORS.textPrimary,
    fontSize: 14,
  },
  subText: {
    ...FONTS.body,
    color: COLORS.textSub,
    fontSize: 12,
  },
  dimText: {
    ...FONTS.body,
    color: COLORS.textDim,
    fontSize: 11,
  },

  // Buttons
  glowBtn: {
    borderWidth: 1,
    borderColor: COLORS.cyan,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 243, 255, 0.05)',
  },
  glowBtnText: {
    ...FONTS.system,
    color: COLORS.cyan,
    fontSize: 13,
  },
  dangerBtn: {
    borderWidth: 1,
    borderColor: COLORS.danger,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 50, 50, 0.08)',
  },
  dangerBtnText: {
    ...FONTS.system,
    color: COLORS.danger,
    fontSize: 13,
  },

  // Progress bars
  barContainer: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderDim,
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
});

export const SCREEN_WIDTH = SCREEN_W;
export const SCREEN_HEIGHT = SCREEN_H;
