import { Platform, TextStyle, ViewStyle } from 'react-native';
import { colors } from './colors';

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  pill: 999,
} as const;

type TypographyKey =
  | 'display'
  | 'title'
  | 'heading'
  | 'body'
  | 'label'
  | 'caption';

export const typography: Record<TypographyKey, TextStyle> = {
  display: { fontSize: 32, lineHeight: 38, fontWeight: '800', letterSpacing: -0.8 },
  title: { fontSize: 26, lineHeight: 32, fontWeight: '800', letterSpacing: -0.5 },
  heading: { fontSize: 18, lineHeight: 24, fontWeight: '700', letterSpacing: -0.2 },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' },
  label: { fontSize: 13, lineHeight: 18, fontWeight: '600' },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
};

function elevation(
  color: string,
  opacity: number,
  offsetY: number,
  blur: number,
  androidElevation: number
): ViewStyle {
  return Platform.select<ViewStyle>({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: blur,
    },
    android: { elevation: androidElevation },
    default: {
      boxShadow: `0px ${offsetY}px ${blur * 2}px rgba(17, 24, 39, ${opacity})`,
    },
  }) as ViewStyle;
}

export const shadows = {
  card: elevation(colors.shadow, 0.1, 8, 14, 5),
  float: elevation(colors.shadow, 0.22, 12, 20, 12),
  primary: elevation(colors.primary, 0.35, 10, 14, 8),
} as const;
