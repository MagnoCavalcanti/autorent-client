import type { Cliente } from './cliente';

export interface Aluguel {
  id: number;
  carro: number;
  cliente: Cliente;
  vendedor: number;
  data_aluguel: string;
  data_devolucao_prevista: string;
  valor_total: string;
}
