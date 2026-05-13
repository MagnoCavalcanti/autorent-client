import { Pencil, Trash2 } from 'lucide-react';
import type { Aluguel } from '../../types/aluguel';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface AlugueisTableProps {
  alugueis: Aluguel[];
  loading: boolean;
  onEdit: (aluguel: Aluguel) => void;
  onDelete: (aluguel: Aluguel) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('pt-BR');
}

function formatCurrency(value: string | undefined): string {
  const numberValue = Number.parseFloat(value ?? '0') || 0;
  return numberValue.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell><div className="h-4 w-32 animate-pulse rounded bg-zinc-800" /></TableCell>
          <TableCell><div className="h-4 w-24 animate-pulse rounded bg-zinc-800" /></TableCell>
          <TableCell><div className="h-4 w-20 animate-pulse rounded bg-zinc-800" /></TableCell>
          <TableCell><div className="h-4 w-20 animate-pulse rounded bg-zinc-800" /></TableCell>
          <TableCell><div className="h-4 w-24 animate-pulse rounded bg-zinc-800" /></TableCell>
          <TableCell><div className="h-4 w-24 animate-pulse rounded bg-zinc-800" /></TableCell>
          <TableCell><div className="h-4 w-20 animate-pulse rounded bg-zinc-800" /></TableCell>
          <TableCell><div className="h-4 w-20 animate-pulse rounded bg-zinc-800" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

function AlugueisTable({ alugueis, loading, onEdit, onDelete }: AlugueisTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/90">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Carro</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>Data aluguel</TableHead>
            <TableHead>Data devolução</TableHead>
            <TableHead>Valor total</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <LoadingRows />
          ) : alugueis.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="py-8 text-center text-zinc-400">
                Nenhum aluguel encontrado.
              </TableCell>
            </TableRow>
          ) : (
            alugueis.map((aluguel) => (
              <TableRow key={aluguel.id ?? `${aluguel.cliente.cpf}-${aluguel.data_aluguel}`}>
                <TableCell>{aluguel.cliente.nome}</TableCell>
                <TableCell>{aluguel.cliente.cpf}</TableCell>
                <TableCell>{aluguel.carro}</TableCell>
                <TableCell>{aluguel.vendedor}</TableCell>
                <TableCell>{formatDate(aluguel.data_aluguel)}</TableCell>
                <TableCell>{formatDate(aluguel.data_devolucao_prevista)}</TableCell>
                <TableCell>{formatCurrency(aluguel.valor_total)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(aluguel)}
                      aria-label={`Editar aluguel de ${aluguel.cliente.nome}`}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(aluguel)}
                      aria-label={`Excluir aluguel de ${aluguel.cliente.nome}`}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default AlugueisTable;
