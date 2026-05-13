import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Navigate, useParams } from 'react-router';
import type { AxiosError } from 'axios';
import api from '../services/api';
import type { Aluguel, AluguelFormData } from '../types/aluguel';
import type { Carro } from '../types/carro';
import type { Vendedor } from '../types/vendedor';
import { Button } from '../components/ui/button';
import AlugueisFiltro from '../components/alugueis/AlugueisFiltro';
import AlugueisTable from '../components/alugueis/AlugueisTable';
import AluguelFormModal from '../components/alugueis/AluguelFormModal';
import AluguelDeleteDialog from '../components/alugueis/AluguelDeleteDialog';

interface ApiErrorResponse {
  detail?: string;
  [key: string]: string | string[] | undefined;
}

interface PaginatedResponse<T> {
  results?: T[];
}

function normalizeArray<T>(data: T[] | PaginatedResponse<T>): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
}

function friendlyApiError(error: unknown): string {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  const detail = axiosError.response?.data?.detail;
  if (detail) return detail;
  return 'Não foi possível concluir a operação agora. Tente novamente.';
}

function AlugueisPage() {
  const { empresa } = useParams<{ empresa: string }>();

  const [alugueis, setAlugueis] = useState<Aluguel[]>([]);
  const [carros, setCarros] = useState<Carro[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [aluguelEditando, setAluguelEditando] = useState<Aluguel | null>(null);
  const [aluguelDeletando, setAluguelDeletando] = useState<Aluguel | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  const carregarAlugueis = useCallback(async () => {
    if (!empresa) return;
    setLoading(true);
    setPageError(null);
    try {
      const [alugueisResponse, carrosResponse, vendedoresResponse] = await Promise.all([
        api.get<Aluguel[] | PaginatedResponse<Aluguel>>(`/${encodeURIComponent(empresa)}/alugueis/`),
        api.get<Carro[] | PaginatedResponse<Carro>>(`/${encodeURIComponent(empresa)}/carros/`),
        api.get<Vendedor[] | PaginatedResponse<Vendedor>>(`/${encodeURIComponent(empresa)}/vendedores/`),
      ]);

      setAlugueis(normalizeArray(alugueisResponse.data));
      setCarros(normalizeArray(carrosResponse.data));
      setVendedores(normalizeArray(vendedoresResponse.data));
    } catch {
      setPageError('Não foi possível carregar os aluguéis. Tente novamente.');
      setAlugueis([]);
      setCarros([]);
      setVendedores([]);
    } finally {
      setLoading(false);
    }
  }, [empresa]);

  useEffect(() => {
    void carregarAlugueis();
  }, [carregarAlugueis]);

  if (!empresa) {
    return <Navigate to="/" replace />;
  }

  const filtroNormalizado = filtro.trim().toLowerCase();
  const alugueisFiltrados = useMemo(() => {
    if (!filtroNormalizado) return alugueis;
    return alugueis.filter((aluguel) => {
      const nome = aluguel.cliente.nome.toLowerCase();
      const cpf = aluguel.cliente.cpf.toLowerCase();
      return nome.includes(filtroNormalizado) || cpf.includes(filtroNormalizado);
    });
  }, [alugueis, filtroNormalizado]);

  const handleNovoAluguel = () => {
    setAluguelEditando(null);
    setFormError(null);
    setModalAberto(true);
  };

  const handleEditar = (aluguel: Aluguel) => {
    setAluguelEditando(aluguel);
    setFormError(null);
    setModalAberto(true);
  };

  const handleSalvar = async (data: AluguelFormData, aluguel?: Aluguel | null) => {
    setFormLoading(true);
    setFormError(null);
    try {
      const baseUrl = `/${encodeURIComponent(empresa)}/alugueis/`;
      if (aluguel?.id) {
        await api.patch(`${baseUrl}${aluguel.id}/`, data);
      } else {
        await api.post(baseUrl, data);
      }
      setModalAberto(false);
      setAluguelEditando(null);
      await carregarAlugueis();
    } catch (error) {
      setFormError(friendlyApiError(error));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletar = async () => {
    if (!aluguelDeletando?.id) return;
    await api.delete(`/${encodeURIComponent(empresa)}/alugueis/${aluguelDeletando.id}/`);
    setAluguelDeletando(null);
    await carregarAlugueis();
  };

  return (
    <div className="space-y-6 bg-zinc-950 p-4 md:p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Aluguéis</h1>
        <Button onClick={handleNovoAluguel}>
          <Plus size={16} />
          Novo Aluguel
        </Button>
      </header>

      <AlugueisFiltro value={filtro} onChange={setFiltro} />

      {pageError && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {pageError}
        </div>
      )}

      <AlugueisTable
        alugueis={alugueisFiltrados}
        loading={loading}
        onEdit={handleEditar}
        onDelete={(aluguel) => setAluguelDeletando(aluguel)}
      />

      <AluguelFormModal
        open={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setAluguelEditando(null);
          setFormError(null);
        }}
        onSuccess={handleSalvar}
        aluguel={aluguelEditando}
        empresa={empresa}
        carros={carros}
        vendedores={vendedores}
        loading={formLoading}
        apiError={formError}
      />

      <AluguelDeleteDialog
        open={Boolean(aluguelDeletando)}
        aluguel={aluguelDeletando}
        onClose={() => setAluguelDeletando(null)}
        onConfirm={handleDeletar}
      />
    </div>
  );
}

export default AlugueisPage;
