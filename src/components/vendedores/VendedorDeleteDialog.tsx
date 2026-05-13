import { useState } from 'react';
import type { Vendedor } from '../../types/vendedor';
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

interface VendedorDeleteDialogProps {
  open: boolean;
  vendedor: Vendedor | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

function VendedorDeleteDialog({ open, vendedor, onClose, onConfirm }: VendedorDeleteDialogProps) {
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
          <AlertDialogTitle>Excluir vendedor</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o vendedor {vendedor?.nome}?
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

export default VendedorDeleteDialog;
