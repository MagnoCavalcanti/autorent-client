export interface Vendedor {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
}

export type VendedorFormData = Omit<Vendedor, 'id'>;
