import { useState } from 'react';
import api from '../../services/api';
import type { ConfirmDeleteModalProps } from '../../types';
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

function ConfirmDeleteModal({
  open,
  onOpenChange,
  carro,
  empresa,
  onSuccess,
}: ConfirmDeleteModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const onDelete = async () => {
    if (!carro || !empresa) return;
    setSubmitting(true);
    try {
      await api.delete(`/${encodeURIComponent(empresa)}/carros/${carro.id}/`);
      onOpenChange(false);
      await onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remover carro</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja remover o carro "{carro?.marca} {carro?.modelo}"?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={submitting}
            className="bg-red-600 hover:bg-red-500"
          >
            {submitting ? 'Removendo...' : 'Remover'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDeleteModal;
