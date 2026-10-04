import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const TAB_BAR_HEIGHT = 64;
export const TAB_BAR_MARGIN = 12;

/** Espaço que o conteúdo precisa reservar no fim por causa da barra flutuante. */
export function useTabBarSpace() {
  const insets = useSafeAreaInsets();
  return TAB_BAR_HEIGHT + Math.max(insets.bottom, TAB_BAR_MARGIN) + 28;
}
