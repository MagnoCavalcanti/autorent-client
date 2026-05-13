import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useParams } from 'react-router';
import type { Carro, CarroFiltroStatus, FeedbackMessage, PaginatedResponse } from '../types';
import { STATUS_OPTIONS } from '../types';
import api from '../services/api';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem } from '../components/ui/select';
import { Spinner } from '../components/ui/spinner';
import CarroCard from '../components/carros/CarroCard';
import CarroFormModal from '../components/carros/CarroFormModal';
import ConfirmDeleteModal from '../components/carros/ConfirmDeleteModal';

function toArrayResponse<T>(data: T[] | PaginatedResponse<T> | null | undefined): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}


function CarrosPage() {
  const { empresa } = useParams<{ empresa: string }>();
  const [carros, setCarros] = useState<Carro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<CarroFiltroStatus>('todos');
  const [formOpen, setFormOpen] = useState(false);
  const [editingCarro, setEditingCarro] = useState<Carro | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingCarro, setDeletingCarro] = useState<Carro | null>(null);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  const listUrl = useMemo(() => {
    if (!empresa) return null;
    const base = `/${encodeURIComponent(empresa)}/carros/`;
    if (statusFilter === 'todos') return base;
    return `${base}?status=${statusFilter}`;
  }, [empresa, statusFilter]);

  const loadCarros = useCallback(async () => {
    if (!listUrl) {
      setError('Empresa inválida para listagem de carros.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Carro[] | PaginatedResponse<Carro>>(listUrl);
      setCarros(toArrayResponse(response.data));
    } catch {
      setError('Não foi possível carregar a frota no momento.');
    } finally {
      setLoading(false);
    }
  }, [listUrl]);

  useEffect(() => {
    void loadCarros();
  }, [loadCarros]);

  const handleCreate = () => {
    setEditingCarro(null);
    setFormOpen(true);
  };

  const handleEdit = (carro: Carro) => {
    setEditingCarro(carro);
    setFormOpen(true);
  };

  const handleDelete = (carro: Carro) => {
    setDeletingCarro(carro);
    setDeleteOpen(true);
  };

  const handleSuccess = async () => {
    await loadCarros();
    setFeedback({ type: 'success', message: 'Operação realizada com sucesso.' });
    setTimeout(() => setFeedback(null), 2500);
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-zinc-950">
        <Spinner className="h-6 w-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-center">
        <h2 className="text-lg font-semibold text-red-300">Erro ao carregar frota</h2>
        <p className="mt-2 text-sm text-red-100/90">{error}</p>
        <Button className="mt-4" onClick={() => void loadCarros()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-zinc-950 p-4 md:p-6">
      {feedback && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
              : 'border-red-500/40 bg-red-500/10 text-red-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Frota</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button onClick={handleCreate}>
            <Plus size={16} />
            Adicionar Carro
          </Button>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as CarroFiltroStatus)}
          >
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {carros.length === 0 ? (
        <Card className="bg-zinc-900/90 border-zinc-800">
          <CardContent className="p-8 text-center text-zinc-400">Nenhum carro cadastrado.</CardContent>
        </Card>
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {carros.map((carro) => (
            <CarroCard key={carro.id} carro={carro} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </section>
      )}

      <CarroFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        empresa={empresa ?? ''}
        carro={editingCarro}
        onSuccess={handleSuccess}
      />

      <ConfirmDeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        carro={deletingCarro}
        empresa={empresa ?? ''}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default CarrosPage;
