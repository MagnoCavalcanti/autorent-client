import { Pencil, Trash2 } from 'lucide-react';
import type { Vendedor } from '../../types/vendedor';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface VendedoresTableProps {
  vendedores: Vendedor[];
  loading: boolean;
  onEdit: (vendedor: Vendedor) => void;
  onDelete: (vendedor: Vendedor) => void;
}

function LoadingRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell><div className="h-4 w-32 animate-pulse rounded bg-zinc-800" /></TableCell>
          <TableCell><div className="h-4 w-24 animate-pulse rounded bg-zinc-800" /></TableCell>
          <TableCell><div className="h-4 w-40 animate-pulse rounded bg-zinc-800" /></TableCell>
          <TableCell><div className="h-4 w-28 animate-pulse rounded bg-zinc-800" /></TableCell>
          <TableCell><div className="h-4 w-20 animate-pulse rounded bg-zinc-800" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

function VendedoresTable({ vendedores, loading, onEdit, onDelete }: VendedoresTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/90">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <LoadingRows />
          ) : vendedores.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-zinc-400">
                Nenhum vendedor encontrado.
              </TableCell>
            </TableRow>
          ) : (
            vendedores.map((vendedor) => (
              <TableRow key={vendedor.id}>
                <TableCell>{vendedor.nome}</TableCell>
                <TableCell>{vendedor.cpf}</TableCell>
                <TableCell>{vendedor.email}</TableCell>
                <TableCell>{vendedor.telefone}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(vendedor)}
                      aria-label={`Editar ${vendedor.nome}`}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(vendedor)}
                      aria-label={`Excluir ${vendedor.nome}`}
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

export default VendedoresTable;
