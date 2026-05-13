import { Pencil, Trash2 } from 'lucide-react';
import type { Cliente } from '../../types/cliente';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface ClientesTableProps {
  clientes: Cliente[];
  loading: boolean;
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
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
          <TableCell><div className="h-4 w-24 animate-pulse rounded bg-zinc-800" /></TableCell>
          <TableCell><div className="h-4 w-20 animate-pulse rounded bg-zinc-800" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

function ClientesTable({ clientes, loading, onEdit, onDelete }: ClientesTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/90">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CPF</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>CEP</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <LoadingRows />
          ) : clientes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="py-8 text-center text-zinc-400">
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          ) : (
            clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.cpf}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell>{cliente.cep}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(cliente)}
                      aria-label={`Editar ${cliente.nome}`}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(cliente)}
                      aria-label={`Excluir ${cliente.nome}`}
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

export default ClientesTable;
