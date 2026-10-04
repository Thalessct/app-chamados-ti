import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TicketCategory } from '../types/ticket';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export const categoryIcons: Record<TicketCategory, IconName> = {
  Hardware: 'hardware-chip-outline',
  Software: 'apps-outline',
  'Rede/Internet': 'wifi-outline',
  'Acesso/Conta': 'key-outline',
  Outros: 'ellipsis-horizontal-circle-outline',
};
