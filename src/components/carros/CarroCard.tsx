import { Car, Pencil, Trash2 } from 'lucide-react';
import type { CarroCardProps } from '../../types';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

function statusLabel(status: string): string {
  if (status === 'disponivel') return 'Disponível';
  if (status === 'indisponivel') return 'Indisponível';
  if (status === 'manutencao') return 'Manutenção';
  return status;
}

function statusBadgeVariant(status: string): 'success' | 'destructive' | 'warning' | 'secondary' {
  if (status === 'disponivel') return 'success';
  if (status === 'indisponivel') return 'destructive';
  if (status === 'manutencao') return 'warning';
  return 'secondary';
}

function CarroCard({ carro, onEdit, onDelete }: CarroCardProps) {
  return (
    <Card className="bg-zinc-900/90 border-zinc-800">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-600/20 p-2 text-blue-300">
              <Car size={18} />
            </div>
            <div>
              <CardTitle className="text-base text-zinc-100">
                {carro.marca} {carro.modelo}
              </CardTitle>
              <p className="text-sm text-zinc-400">
                {carro.ano} - {carro.placa}
              </p>
            </div>
          </div>
          <Badge variant={statusBadgeVariant(carro.status)}>{statusLabel(carro.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-zinc-300">
          Preço base/dia:{' '}
          <span className="font-semibold text-zinc-100">
            {formatCurrency(Number.parseFloat(carro.preco_base_dia) || 0)}
          </span>
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(carro)} className="flex-1">
            <Pencil size={16} />
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(carro)}
            className="flex-1"
          >
            <Trash2 size={16} />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default CarroCard;
