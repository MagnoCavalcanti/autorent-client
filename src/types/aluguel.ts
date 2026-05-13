export interface ClienteAluguel {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cep: string;
}

export interface Aluguel {
  id?: number;
  carro: number;
  cliente: ClienteAluguel;
  vendedor: number;
  data_aluguel: string;
  data_devolucao_prevista: string;
  valor_total?: string;
}

export type AluguelFormData = Omit<Aluguel, 'id' | 'valor_total'>;
