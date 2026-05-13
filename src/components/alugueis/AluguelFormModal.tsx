import { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Aluguel, AluguelFormData } from '../../types/aluguel';
import type { Carro } from '../../types/carro';
import type { Vendedor } from '../../types/vendedor';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const aluguelSchema = z
  .object({
    carro: z.coerce.number().min(1, 'Selecione um carro'),
    vendedor: z.coerce.number().min(1, 'Selecione um vendedor'),
    data_aluguel: z
      .string()
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Informe a data do aluguel no formato dd/mm/aaaa'),
    data_devolucao_prevista: z
      .string()
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, 'Informe a data de devolução no formato dd/mm/aaaa'),
    cliente: z.object({
      nome: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
      cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
      email: z.string().email('Email inválido'),
      telefone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, 'Telefone inválido'),
      cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
    }),
  })
  .refine(
    (data) =>
      parseBrDate(data.data_aluguel) !== null &&
      parseBrDate(data.data_devolucao_prevista) !== null,
    { message: 'Data inválida', path: ['data_aluguel'] }
  )
  .refine(
    (data) => {
      const aluguelDate = parseBrDate(data.data_aluguel);
      const devolucaoDate = parseBrDate(data.data_devolucao_prevista);
      if (!aluguelDate || !devolucaoDate) return false;
      return devolucaoDate >= aluguelDate;
    },
    {
      message: 'A data de devolução deve ser posterior ou igual à data do aluguel',
      path: ['data_devolucao_prevista'],
    }
  );

type AluguelSchemaData = z.infer<typeof aluguelSchema>;
type AluguelSchemaInput = z.input<typeof aluguelSchema>;

function normalizeDateBr(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function parseBrDate(value: string): Date | null {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (
    Number.isNaN(date.getTime()) ||
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    return null;
  }
  return date;
}

function brToIso(value: string): string {
  const date = parseBrDate(value);
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isoToBr(value: string): string {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return '';
  return `${match[3]}/${match[2]}/${match[1]}`;
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
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

interface AluguelFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: AluguelFormData, aluguel?: Aluguel | null) => Promise<void>;
  aluguel?: Aluguel | null;
  empresa: string;
  carros: Carro[];
  vendedores: Vendedor[];
  loading?: boolean;
  apiError?: string | null;
}

function AluguelFormModal({
  open,
  onClose,
  onSuccess,
  aluguel,
  empresa,
  carros,
  vendedores,
  loading = false,
  apiError = null,
}: AluguelFormModalProps) {
  const isEdicao = useMemo(() => Boolean(aluguel), [aluguel]);
  const carrosDisponiveis = useMemo(
    () => carros.filter((carro) => carro.status === 'disponivel'),
    [carros]
  );

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm<AluguelSchemaInput, unknown, AluguelSchemaData>({
    resolver: zodResolver(aluguelSchema),
    defaultValues: {
      carro: 0,
      vendedor: 0,
      data_aluguel: '',
      data_devolucao_prevista: '',
      cliente: { nome: '', cpf: '', email: '', telefone: '', cep: '' },
    },
  });

  useEffect(() => {
    if (!open) return;
    if (aluguel) {
      reset({
        carro: aluguel.carro,
        vendedor: aluguel.vendedor,
        data_aluguel: isoToBr(aluguel.data_aluguel),
        data_devolucao_prevista: isoToBr(aluguel.data_devolucao_prevista),
        cliente: {
          nome: aluguel.cliente.nome,
          cpf: aluguel.cliente.cpf,
          email: aluguel.cliente.email,
          telefone: aluguel.cliente.telefone,
          cep: aluguel.cliente.cep,
        },
      });
      return;
    }
    reset({
      carro: 0,
      vendedor: 0,
      data_aluguel: '',
      data_devolucao_prevista: '',
      cliente: { nome: '', cpf: '', email: '', telefone: '', cep: '' },
    });
  }, [open, aluguel, reset]);

  const submit = async (data: AluguelSchemaData) => {
    if (!empresa) return;
    const payload: AluguelFormData = {
      carro: data.carro,
      vendedor: data.vendedor,
      cliente: data.cliente,
      data_aluguel: brToIso(data.data_aluguel),
      data_devolucao_prevista: brToIso(data.data_devolucao_prevista),
    };
    await onSuccess(payload, aluguel);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle>{isEdicao ? 'Editar aluguel' : 'Novo aluguel'}</DialogTitle>
          <DialogDescription>
            {isEdicao ? 'Atualize os dados do aluguel.' : 'Preencha os dados para registrar um novo aluguel.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {/* Carro */}
            <div className="grid gap-2">
              <Label>Carro</Label>
              <Controller
                name="carro"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Selecione um carro" />
                    </SelectTrigger>
                    <SelectContent>
                      {carrosDisponiveis.map((carro) => (
                        <SelectItem key={carro.id} value={String(carro.id)}>
                          {carro.modelo} — {carro.placa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.carro && <p className="text-xs text-red-400">{errors.carro.message}</p>}
            </div>

            {/* Vendedor */}
            <div className="grid gap-2">
              <Label>Vendedor</Label>
              <Controller
                name="vendedor"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ''}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Selecione um vendedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendedores.map((vendedor) => (
                        <SelectItem key={vendedor.id} value={String(vendedor.id)}>
                          {vendedor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.vendedor && <p className="text-xs text-red-400">{errors.vendedor.message}</p>}
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="data_aluguel">Data aluguel</Label>
              <Input
                id="data_aluguel"
                type="text"
                inputMode="numeric"
                placeholder="dd/mm/aaaa"
                {...register('data_aluguel')}
                onChange={(e) =>
                  setValue('data_aluguel', normalizeDateBr(e.target.value), { shouldValidate: true })
                }
              />
              {errors.data_aluguel && <p className="text-xs text-red-400">{errors.data_aluguel.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="data_devolucao_prevista">Data devolução</Label>
              <Input
                id="data_devolucao_prevista"
                type="text"
                inputMode="numeric"
                placeholder="dd/mm/aaaa"
                {...register('data_devolucao_prevista')}
                onChange={(e) =>
                  setValue('data_devolucao_prevista', normalizeDateBr(e.target.value), { shouldValidate: true })
                }
              />
              {errors.data_devolucao_prevista && (
                <p className="text-xs text-red-400">{errors.data_devolucao_prevista.message}</p>
              )}
            </div>
          </div>

          {/* Cliente */}
          <div className="grid gap-2">
            <Label htmlFor="cliente.nome">Nome cliente</Label>
            <Input id="cliente.nome" {...register('cliente.nome')} />
            {errors.cliente?.nome && <p className="text-xs text-red-400">{errors.cliente.nome.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="cliente.cpf">CPF</Label>
              <Input
                id="cliente.cpf"
                {...register('cliente.cpf')}
                onChange={(e) => setValue('cliente.cpf', formatCpf(e.target.value), { shouldValidate: true })}
              />
              {errors.cliente?.cpf && <p className="text-xs text-red-400">{errors.cliente.cpf.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cliente.email">Email</Label>
              <Input id="cliente.email" type="email" {...register('cliente.email')} />
              {errors.cliente?.email && <p className="text-xs text-red-400">{errors.cliente.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="cliente.telefone">Telefone</Label>
              <Input
                id="cliente.telefone"
                {...register('cliente.telefone')}
                onChange={(e) => setValue('cliente.telefone', formatTelefone(e.target.value), { shouldValidate: true })}
              />
              {errors.cliente?.telefone && <p className="text-xs text-red-400">{errors.cliente.telefone.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cliente.cep">CEP</Label>
              <Input
                id="cliente.cep"
                {...register('cliente.cep')}
                onChange={(e) => setValue('cliente.cep', formatCep(e.target.value), { shouldValidate: true })}
              />
              {errors.cliente?.cep && <p className="text-xs text-red-400">{errors.cliente.cep.message}</p>}
            </div>
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

export default AluguelFormModal;