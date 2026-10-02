export type TicketStatus = 'ABERTO' | 'FECHADO';

export type TicketCategory =
  | 'Hardware'
  | 'Software'
  | 'Rede/Internet'
  | 'Acesso/Conta'
  | 'Outros';

export interface Ticket {
  id: string;
  title: string;
  category: TicketCategory;
  description: string;
  status: TicketStatus;
  createdAt: string;
  closedAt?: string;
}