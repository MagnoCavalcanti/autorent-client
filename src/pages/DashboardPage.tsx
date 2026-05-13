import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';
import type { Aluguel, Carro, Cliente, MesAgrupado, Vendedor } from '../types';
import {
  Card,
  CardContent,
  CardHeader,
} from '../components/ui/card';
import { Spinner } from '../components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Button } from '../components/ui/button';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

interface PaginatedResponse<T> {
  results?: T[];
}

const chartColors = [
  '#3B82F6',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#06B6D4',
  '#84CC16',
  '#F97316',
];

function toDateOnly(dateString: string): Date {
  return new Date(`${dateString}T00:00:00`);
}

function isAtivo(aluguel: Aluguel): boolean {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  return toDateOnly(aluguel.data_devolucao_prevista) >= hoje;
}

function agruparPorMes(alugueis: Aluguel[]): MesAgrupado[] {
  const grouped = alugueis.reduce<Record<string, MesAgrupado>>((acc, aluguel) => {
    const [year, month] = aluguel.data_aluguel.split('-');
    const chave = `${year}-${month}`;
    const current = acc[chave];
    const receita = Number.parseFloat(aluguel.valor_total) || 0;

    if (!current) {
      const date = new Date(Number(year), Number(month) - 1, 1);
      const label = date.toLocaleDateString('pt-BR', {
        month: 'short',
        year: '2-digit',
      });

      acc[chave] = {
        chave,
        label: label.charAt(0).toUpperCase() + label.slice(1),
        count: 1,
        receita,
      };
      return acc;
    }

    current.count += 1;
    current.receita += receita;
    return acc;
  }, {});

  return Object.values(grouped).sort((a, b) => a.chave.localeCompare(b.chave));
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
}

function formatDate(dateString: string): string {
  return toDateOnly(dateString).toLocaleDateString('pt-BR');
}

function toArrayResponse<T>(data: T[] | PaginatedResponse<T> | null | undefined): T[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function DashboardPage() {
  const { user } = useAuth();
  const { empresa } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carros, setCarros] = useState<Carro[]>([]);
  const [alugueis, setAlugueis] = useState<Aluguel[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);

  const empresaNome = empresa ?? '';

  const carregarDados = useCallback(async () => {
    if (!empresaNome) {
      setError('Não foi possível identificar a empresa do usuário logado.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const empresaPath = encodeURIComponent(empresaNome);
      const [carrosResponse, , alugueisResponse, clientesResponse, vendedoresResponse] =
        await Promise.all([
          api.get<Carro[] | PaginatedResponse<Carro>>(`/${empresaPath}/carros/`),
          api.get<Carro[] | PaginatedResponse<Carro>>(`/${empresaPath}/carros/?status=disponivel`),
          api.get<Aluguel[] | PaginatedResponse<Aluguel>>(`/${empresaPath}/alugueis/`),
          api.get<Cliente[] | PaginatedResponse<Cliente>>('/clientes/'),
          api.get<Vendedor[] | PaginatedResponse<Vendedor>>(`/${empresaPath}/vendedores/`),
        ]);

      setCarros(toArrayResponse(carrosResponse.data));
      setAlugueis(toArrayResponse(alugueisResponse.data));
      setClientes(toArrayResponse(clientesResponse.data));
      setVendedores(toArrayResponse(vendedoresResponse.data));
    } catch (loadError) {
      console.error('Erro ao carregar dashboard:', loadError);
      setError(
        'Não foi possível carregar os dados do dashboard agora. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  }, [empresaNome]);

  useEffect(() => {
    void carregarDados();
  }, [carregarDados]);

  const totalCarros = carros.length;
  const carrosDisponiveis = carros.filter((carro) => carro.status === 'disponivel').length;
  const alugueisAtivos = alugueis.filter(isAtivo).length;
  const receitaTotal = alugueis.reduce(
    (acc, aluguel) => acc + (Number.parseFloat(aluguel.valor_total) || 0),
    0
  );
  const totalClientes = clientes.length;
  const totalVendedores = vendedores.length;

  const statusFrotaData = useMemo(
    () =>
      Object.entries(
        carros.reduce<Record<string, number>>((acc, carro) => {
          const key = carro.status || 'indefinido';
          acc[key] = (acc[key] ?? 0) + 1;
          return acc;
        }, {})
      ).map(([name, value]) => ({ name, value })),
    [carros]
  );

  const mesesAgrupados = useMemo(() => agruparPorMes(alugueis), [alugueis]);
  const mesesComDados = useMemo(() => mesesAgrupados.slice(-6), [mesesAgrupados]);

  const ultimosAlugueis = useMemo(
    () =>
      [...alugueis]
        .sort((a, b) => toDateOnly(b.data_aluguel).getTime() - toDateOnly(a.data_aluguel).getTime())
        .slice(0, 5),
    [alugueis]
  );

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto mt-10 max-w-xl rounded-xl border border-red-500/40 bg-red-500/10 p-6 text-center">
        <h2 className="text-lg font-semibold text-red-300">Erro ao carregar dashboard</h2>
        <p className="mt-2 text-sm text-red-100/90">{error}</p>
        <Button
          variant="destructive"
          className="mt-4"
          onClick={() => {
            void carregarDados();
          }}
        >
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <header>
        <h1 className="text-2xl font-bold text-zinc-100">
          Bom dia, {user?.username ?? 'Usuário'}! - {empresaNome}
        </h1>
        <p className="text-sm text-zinc-400">
          Visão geral da operação de aluguel de veículos.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Card className="bg-zinc-900/90">
          <CardHeader className="pb-0 text-xs text-zinc-400">Total de Carros</CardHeader>
          <CardContent className="pt-2 text-2xl font-bold text-zinc-100">{totalCarros}</CardContent>
        </Card>
        <Card className="bg-zinc-900/90">
          <CardHeader className="pb-0 text-xs text-zinc-400">Carros Disponíveis</CardHeader>
          <CardContent className="pt-2 text-2xl font-bold text-emerald-300">{carrosDisponiveis}</CardContent>
        </Card>
        <Card className="bg-zinc-900/90">
          <CardHeader className="pb-0 text-xs text-zinc-400">Aluguéis Ativos</CardHeader>
          <CardContent className="pt-2 text-2xl font-bold text-blue-300">{alugueisAtivos}</CardContent>
        </Card>
        <Card className="bg-zinc-900/90">
          <CardHeader className="pb-0 text-xs text-zinc-400">Receita Total</CardHeader>
          <CardContent className="pt-2 text-xl font-bold text-amber-300">{formatCurrency(receitaTotal)}</CardContent>
        </Card>
        <Card className="bg-zinc-900/90">
          <CardHeader className="pb-0 text-xs text-zinc-400">Total de Clientes</CardHeader>
          <CardContent className="pt-2 text-2xl font-bold text-zinc-100">{totalClientes}</CardContent>
        </Card>
        <Card className="bg-zinc-900/90">
          <CardHeader className="pb-0 text-xs text-zinc-400">Total de Vendedores</CardHeader>
          <CardContent className="pt-2 text-2xl font-bold text-zinc-100">{totalVendedores}</CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="bg-zinc-900/90">
          <CardHeader className="font-semibold text-zinc-100">Status da Frota</CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusFrotaData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {statusFrotaData.map((entry, index) => (
                    <Cell
                      key={`${entry.name}-${index}`}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/90">
          <CardHeader className="font-semibold text-zinc-100">Aluguéis por mês</CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mesesComDados}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="label" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" allowDecimals={false} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="bg-zinc-900/90">
          <CardHeader className="font-semibold text-zinc-100">Receita por mês</CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mesesComDados}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
                <XAxis dataKey="label" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <RechartsTooltip
                  formatter={(value: ValueType | undefined) =>
                    formatCurrency(typeof value === 'number' ? value : Number(value ?? 0))
                  }
                />
                <Line
                  type="monotone"
                  dataKey="receita"
                  stroke="#10B981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="bg-zinc-900/90">
          <CardHeader className="font-semibold text-zinc-100">
            Tabela - Últimos 5 aluguéis
          </CardHeader>
          <CardContent>
            <Table aria-label="Tabela de últimos aluguéis">
              <TableHeader>
                <TableRow>
                  <TableHead>CLIENTE</TableHead>
                  <TableHead>CARRO</TableHead>
                  <TableHead>VENDEDOR</TableHead>
                  <TableHead>DATA ALUGUEL</TableHead>
                  <TableHead>DEVOLUÇÃO PREVISTA</TableHead>
                  <TableHead>VALOR TOTAL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimosAlugueis.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">Nenhum aluguel encontrado.</TableCell>
                  </TableRow>
                ) : (
                  ultimosAlugueis.map((aluguel) => (
                    <TableRow key={aluguel.id}>
                      <TableCell>{aluguel.cliente?.nome ?? '-'}</TableCell>
                      <TableCell>{aluguel.carro}</TableCell>
                      <TableCell>{aluguel.vendedor}</TableCell>
                      <TableCell>{formatDate(aluguel.data_aluguel)}</TableCell>
                      <TableCell>{formatDate(aluguel.data_devolucao_prevista)}</TableCell>
                      <TableCell>{formatCurrency(Number.parseFloat(aluguel.valor_total) || 0)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default DashboardPage;
