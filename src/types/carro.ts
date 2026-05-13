export interface Carro {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  placa: string;
  status: 'disponivel' | 'indisponivel' | 'manutencao';
  preco_base_dia: string;
}
