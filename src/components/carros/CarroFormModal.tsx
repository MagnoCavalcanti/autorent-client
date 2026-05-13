import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../../services/api';
import type { CarroFormModalProps, CarroFormValues, CarroStatus } from '../../types';
import { STATUS_OPTIONS } from '../../types';
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
import { Select, SelectContent, SelectItem } from '../ui/select';

const carroFormSchema = z.object({
  marca: z.string().min(1, 'Marca é obrigatória'),
  modelo: z.string().min(1, 'Modelo é obrigatório'),
  ano: z.coerce
    .number()
    .int('Ano inválido')
    .min(1900, 'Ano inválido')
    .max(new Date().getFullYear() + 1, 'Ano inválido'),
  placa: z
    .string()
    .min(1, 'Placa é obrigatória')
    .regex(
      /^[A-Z]{3}-\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/,
      'Placa deve ser nesse formato: XXX-0000 ou ABC1D23'
    ),
  status: z.enum(STATUS_OPTIONS.map((status) => status.value) as [CarroStatus, ...CarroStatus[]]),
  preco_base_dia: z.coerce.number().positive('Preço deve ser maior que zero'),
});

function CarroFormModal({ open, onOpenChange, empresa, carro, onSuccess }: CarroFormModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CarroFormValues>({
    resolver: zodResolver(carroFormSchema),
    defaultValues: {
      marca: '',
      modelo: '',
      ano: new Date().getFullYear(),
      placa: '',
      status: 'disponivel',
      preco_base_dia: 0,
    },
  });

  const statusValue = watch('status');

  useEffect(() => {
    if (!open) return;

    if (carro) {
      reset({
        marca: carro.marca,
        modelo: carro.modelo,
        ano: carro.ano,
        placa: carro.placa,
        status: carro.status,
        preco_base_dia: Number.parseFloat(carro.preco_base_dia) || 0,
      });
      return;
    }

    reset({
      marca: '',
      modelo: '',
      ano: new Date().getFullYear(),
      placa: '',
      status: 'disponivel',
      preco_base_dia: 0,
    });
  }, [carro, open, reset]);

  const onSubmit = async (data: CarroFormValues) => {
    if (!empresa) return;
    setSubmitting(true);
    try {
      const payload = {
        marca: data.marca,
        modelo: data.modelo,
        ano: data.ano,
        placa: data.placa.toUpperCase(),
        status: data.status,
        preco_base_dia: data.preco_base_dia.toFixed(2),
      };

      if (carro) {
        await api.put(`/${encodeURIComponent(empresa)}/carros/${carro.id}/`, payload);
      } else {
        await api.post(`/${encodeURIComponent(empresa)}/carros/`, payload);
      }

      onOpenChange(false);
      await onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle>{carro ? 'Editar carro' : 'Adicionar carro'}</DialogTitle>
          <DialogDescription>
            {carro
              ? 'Atualize os dados do carro da frota.'
              : 'Preencha os dados para cadastrar um novo carro.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="marca">Marca</Label>
            <Input id="marca" {...register('marca')} />
            {errors.marca && <p className="text-xs text-red-400">{errors.marca.message}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="modelo">Modelo</Label>
            <Input id="modelo" {...register('modelo')} />
            {errors.modelo && <p className="text-xs text-red-400">{errors.modelo.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="ano">Ano</Label>
              <Input
                id="ano"
                type="number"
                min={1900}
                max={new Date().getFullYear() + 1}
                {...register('ano')}
              />
              {errors.ano && <p className="text-xs text-red-400">{errors.ano.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="placa">Placa</Label>
              <Input
                id="placa"
                {...register('placa')}
                onChange={(event) => {
                  setValue('placa', event.target.value.toUpperCase(), { shouldValidate: true });
                }}
              />
              {errors.placa && <p className="text-xs text-red-400">{errors.placa.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={statusValue}
                onValueChange={(value) =>
                  setValue('status', value as CarroStatus, { shouldValidate: true })
                }
              >
                <SelectContent>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-xs text-red-400">{errors.status.message}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preco_base_dia">Preço base/dia</Label>
              <Input
                id="preco_base_dia"
                type="number"
                step="0.01"
                min="0.01"
                {...register('preco_base_dia')}
              />
              {errors.preco_base_dia && (
                <p className="text-xs text-red-400">{errors.preco_base_dia.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Salvando...' : carro ? 'Salvar alterações' : 'Cadastrar carro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CarroFormModal;
