import { useState } from 'react';
import type { Cliente } from '../../types/cliente';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

interface ClienteDeleteDialogProps {
  open: boolean;
  cliente: Cliente | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function ClienteDeleteDialog({ open, cliente, onClose, onConfirm }: ClienteDeleteDialogProps) {
  const [loading, setLoading] = useState(false);

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(value) => !value && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir cliente</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o cliente {cliente?.nome}? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={confirmDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-500"
          >
            {loading ? 'Excluindo...' : 'Confirmar exclusão'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ClienteDeleteDialog;
