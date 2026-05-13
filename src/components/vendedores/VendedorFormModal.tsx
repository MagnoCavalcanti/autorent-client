import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Vendedor, VendedorFormData } from '../../types/vendedor';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const vendedorSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  cpf: z
    .string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00'),
  email: z.string().email('Email inválido'),
  telefone: z
    .string()
    .regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone deve estar no formato (00) 00000-0000'),
});

interface VendedorFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: VendedorFormData, vendedor?: Vendedor | null) => Promise<void>;
  vendedor?: Vendedor | null;
  empresa: string;
  loading?: boolean;
  apiError?: string | null;
}

function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9)}`;
}

function formatTelefone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function VendedorFormModal({
  open,
  onClose,
  onSuccess,
  vendedor,
  empresa,
  loading = false,
  apiError = null,
}: VendedorFormModalProps) {
  const isEdicao = useMemo(() => Boolean(vendedor), [vendedor]);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<VendedorFormData>({
    resolver: zodResolver(vendedorSchema),
    defaultValues: {
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
    },
  });

  useEffect(() => {
    if (!open) return;
    if (vendedor) {
      reset({
        nome: vendedor.nome,
        cpf: vendedor.cpf,
        email: vendedor.email,
        telefone: vendedor.telefone,
      });
      return;
    }
    reset({
      nome: '',
      cpf: '',
      email: '',
      telefone: '',
    });
  }, [open, vendedor, reset]);

  const submit = async (data: VendedorFormData) => {
    if (!empresa) return;
    await onSuccess(data, vendedor);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle>{isEdicao ? 'Editar vendedor' : 'Novo vendedor'}</DialogTitle>
          <DialogDescription>
            {isEdicao
              ? 'Atualize os dados do vendedor.'
              : 'Preencha os dados para cadastrar um novo vendedor.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input id="nome" {...register('nome')} />
            {errors.nome && <p className="text-xs text-red-400">{errors.nome.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              {...register('cpf')}
              onChange={(event) => {
                setValue('cpf', formatCpf(event.target.value), { shouldValidate: true });
              }}
            />
            {errors.cpf && <p className="text-xs text-red-400">{errors.cpf.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              {...register('telefone')}
              onChange={(event) => {
                setValue('telefone', formatTelefone(event.target.value), { shouldValidate: true });
              }}
            />
            {errors.telefone && <p className="text-xs text-red-400">{errors.telefone.message}</p>}
          </div>

          {apiError && (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {apiError}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default VendedorFormModal;
