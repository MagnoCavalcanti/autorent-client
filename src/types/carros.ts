import type { Carro } from './carro';

export const STATUS_OPTIONS = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'indisponivel', label: 'Indisponível' },
  { value: 'manutencao', label: 'Manutenção' },
] as const;

export type CarroStatus = (typeof STATUS_OPTIONS)[number]['value'];
export type CarroFiltroStatus = 'todos' | CarroStatus;

export interface PaginatedResponse<T> {
  results?: T[];
}

export interface FeedbackMessage {
  type: 'success' | 'error';
  message: string;
}

export interface CarroFormValues {
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  status: CarroStatus;
  preco_base_dia: number;
}

export interface CarroCardProps {
  carro: Carro;
  onEdit: (carro: Carro) => void;
  onDelete: (carro: Carro) => void;
}

export interface CarroFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresa: string;
  carro?: Carro | null;
  onSuccess: () => Promise<void>;
}

export interface ConfirmDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  carro?: Carro | null;
  empresa: string;
  onSuccess: () => Promise<void>;
}
