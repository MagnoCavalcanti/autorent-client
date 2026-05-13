export interface Cliente {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cep: string;
}

export type ClienteFormData = Omit<Cliente, 'id'>;
