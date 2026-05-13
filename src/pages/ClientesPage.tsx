import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useParams } from 'react-router';
import type { AxiosError } from 'axios';
import api from '../services/api';
import type { Cliente, ClienteFormData } from '../types/cliente';
import { Button } from '../components/ui/button';
import ClientesFiltro from '../components/clientes/ClientesFiltro';
import ClientesTable from '../components/clientes/ClientesTable';
import ClienteFormModal from '../components/clientes/ClienteFormModal';
import ClienteDeleteDialog from '../components/clientes/ClienteDeleteDialog';

interface ClientesApiResponse {
  results?: Cliente[];
}

interface ApiErrorResponse {
  detail?: string;
  [key: string]: string | string[] | undefined;
}

function normalizeClientes(data: Cliente[] | ClientesApiResponse): Cliente[] {
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

function ClientesPage() {
  const { empresa } = useParams<{ empresa: string }>();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [cpfFiltro, setCpfFiltro] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [clienteDeletando, setClienteDeletando] = useState<Cliente | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  const cpfDigits = useMemo(() => cpfFiltro.replace(/\D/g, ''), [cpfFiltro]);

  const carregarClientes = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      const url = cpfDigits ? `/clientes/?cpf=${cpfDigits}` : '/clientes/';
      const response = await api.get<Cliente[] | ClientesApiResponse>(url);
      setClientes(normalizeClientes(response.data));
    } catch {
      setPageError('Não foi possível carregar os clientes. Tente novamente.');
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, [cpfDigits]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void carregarClientes();
    }, 500);
    return () => clearTimeout(timer);
  }, [carregarClientes, cpfFiltro]);

  const handleEditar = (cliente: Cliente) => {
    setClienteEditando(cliente);
    setApiError(null);
    setModalAberto(true);
  };

  const handleNovoCliente = () => {
    setClienteEditando(null);
    setApiError(null);
    setModalAberto(true);
  };

  const handleSalvarCliente = async (data: ClienteFormData, cliente?: Cliente | null) => {
    setFormLoading(true);
    setApiError(null);
    try {
      if (cliente) {
        await api.patch(`/clientes/${cliente.id}/`, data);
      } else {
        await api.post('/clientes/', data);
      }

      setModalAberto(false);
      setClienteEditando(null);
      await carregarClientes();
    } catch (error) {
      setApiError(friendlyApiError(error));
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeletar = async () => {
    if (!clienteDeletando) return;
    await api.delete(`/clientes/${clienteDeletando.id}/`);
    setClienteDeletando(null);
    await carregarClientes();
  };

  return (
    <div className="space-y-6 bg-zinc-950 p-4 md:p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-zinc-100">Clientes</h1>
        <Button onClick={handleNovoCliente}>
          <Plus size={16} />
          Novo Cliente
        </Button>
      </header>

      <ClientesFiltro value={cpfFiltro} onChange={setCpfFiltro} />

      {pageError && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {pageError}
        </div>
      )}

      <ClientesTable
        clientes={clientes}
        loading={loading}
        onEdit={handleEditar}
        onDelete={(cliente) => setClienteDeletando(cliente)}
      />

      <ClienteFormModal
        open={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setClienteEditando(null);
          setApiError(null);
        }}
        onSuccess={handleSalvarCliente}
        cliente={clienteEditando}
        loading={formLoading}
        apiError={apiError}
      />

      <ClienteDeleteDialog
        open={Boolean(clienteDeletando)}
        cliente={clienteDeletando}
        onClose={() => setClienteDeletando(null)}
        onConfirm={handleDeletar}
      />

      {!empresa && (
        <p className="text-xs text-zinc-500">
          Empresa não identificada na URL. A rota esperada é /:empresa/clientes.
        </p>
      )}
    </div>
  );
}

export default ClientesPage;
