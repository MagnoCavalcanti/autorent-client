import { useState } from 'react';
import type { Aluguel } from '../../types/aluguel';
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

interface AluguelDeleteDialogProps {
  open: boolean;
  aluguel: Aluguel | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function AluguelDeleteDialog({ open, aluguel, onClose, onConfirm }: AluguelDeleteDialogProps) {
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
          <AlertDialogTitle>Excluir aluguel</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir este aluguel?
            <br />
            Esta ação não pode ser desfeita.
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

export default AluguelDeleteDialog;
