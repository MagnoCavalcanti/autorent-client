import { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { Navigate, useParams } from 'react-router';
import type { AxiosError } from 'axios';
import api from '../services/api';
import type { Vendedor, VendedorFormData } from '../types/vendedor';
import { Button } from '../components/ui/button';
import VendedoresFiltro from '../components/vendedores/VendedoresFiltro';
import VendedoresTable from '../components/vendedores/VendedoresTable';
import VendedorFormModal from '../components/vendedores/VendedorFormModal';
import VendedorDeleteDialog from '../components/vendedores/VendedorDeleteDialog';

interface VendedoresApiResponse {
  results?: Vendedor[];
}

interface ApiErrorResponse {
  detail?: string;
  [key: string]: string | string[] | undefined;
}

function normalizeVendedores(data: Vendedor[] | VendedoresApiResponse): Vendedor[] {
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

function VendedoresPage() {
  const { empresa } = useParams<{ empresa: string }>();

  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [nomeFiltro, setNomeFiltro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [vendedorEditando, setVendedorEditando] = useState<Vendedor | null>(null);
  const [vendedorDeletando, setVendedorDeletando] = useState<Vendedor | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  const carregarVendedores = useCallback(async () => {
    if (!empresa) return;
    setLoading(true);
    setPageError(null);
    try {
      const baseUrl = `/${encodeURIComponent(empresa)}/vendedores/`;
      const url = nomeFiltro.trim() ? `${baseUrl}?search=${encodeURIComponent(nomeFiltro.trim())}` : baseUrl;
      const response = await api.get<Vendedor[] | VendedoresApiResponse>(url);
      setVendedores(normalizeVendedores(response.data));
    } catch {
      setPageError('Não foi possível carregar os vendedores. Tente novamente.');
      setVendedores([]);
    } finally {
      setLoading(false);
    }
  }, [empresa, nomeFiltro]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void carregarVendedores();
    }, 500);
    return () => clearTimeout(timer);
  }, [carregarVendedores]);

  if (!empresa) {
    return <Navigate to="/" replace />;
  }

  const handleNovoVendedor = () => {
    setVendedorEditando(null);
    setApiError(null);
    setModalAberto(true);
  };

  const handleEditar = (vendedor: Vendedor) => {
    setVendedorEditando(vendedor);
    setApiError(null);
    setModalAberto(true);
  };

  const handleSalvarVendedor = async (data: VendedorFormData, vendedor?: Vendedor | null) => {
    setFormLoading(true);
    setApiError(null);
    try {
      const baseUrl = `/${encodeURIComponent(empresa)}/vendedores/`;
      if (vendedor) {
        await api.patch(`${baseUrl}${vendedor.id}/`, data);
      } else {
        await api.post(baseUrl, data);
      }

      setModalAberto(false);
      setVendedorEditando(null);
      await carregarVendedores();
    } catch (error) {
      setApiError(friendlyApiError(error));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletar = async () => {
    if (!vendedorDeletando) return;
    await api.delete(`/${encodeURIComponent(empresa)}/vendedores/${vendedorDeletando.id}/`);
    setVendedorDeletando(null);
    await carregarVendedores();
  };

  return (
    <div className="space-y-6 bg-zinc-950 p-4 md:p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Vendedores</h1>
        <Button onClick={handleNovoVendedor}>
          <Plus size={16} />
          Novo Vendedor
        </Button>
      </header>

      <VendedoresFiltro value={nomeFiltro} onChange={setNomeFiltro} />

      {pageError && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {pageError}
        </div>
      )}

      <VendedoresTable
        vendedores={vendedores}
        loading={loading}
        onEdit={handleEditar}
        onDelete={(vendedor) => setVendedorDeletando(vendedor)}
      />

      <VendedorFormModal
        open={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setVendedorEditando(null);
          setApiError(null);
        }}
        onSuccess={handleSalvarVendedor}
        vendedor={vendedorEditando}
        empresa={empresa}
        loading={formLoading}
        apiError={apiError}
      />

      <VendedorDeleteDialog
        open={Boolean(vendedorDeletando)}
        vendedor={vendedorDeletando}
        onClose={() => setVendedorDeletando(null)}
        onConfirm={handleDeletar}
      />
    </div>
  );
}

export default VendedoresPage;
