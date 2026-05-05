import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';

/**
 * Exemplo completo de um componente que:
 * 1. Usa autenticação
 * 2. Faz requisições autenticadas
 * 3. Trata erros
 * 4. Mostra estado de carregamento
 */

interface Frota {
  id: number;
  placa: string;
  modelo: string;
  ano: number;
}

export const FrotaExemplo: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [frotas, setFrotas] = useState<Frota[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar frotas quando o componente monta
  React.useEffect(() => {
    if (!authLoading && user) {
      loadFrotas();
    }
  }, [user, authLoading]);

  // Função para carregar frotas
  const loadFrotas = async () => {
    try {
      setLoading(true);
      setError(null);

      // Faz a requisição - o Authorization header é injetado automaticamente
      const response = await api.get<Frota[]>('/frotas/');
      setFrotas(response.data);
    } catch (err) {
      console.error('Erro ao carregar frotas:', err);
      setError('Erro ao carregar frotas');
    } finally {
      setLoading(false);
    }
  };

  // Função para criar nova frota
  const createFrota = async (novaFrota: Omit<Frota, 'id'>) => {
    try {
      setLoading(true);
      setError(null);

      // Faz POST - também com Authorization automático
      const response = await api.post<Frota>('/frotas/', novaFrota);
      setFrotas([...frotas, response.data]);
    } catch (err) {
      console.error('Erro ao criar frota:', err);
      setError('Erro ao criar frota');
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar frota
  const deleteFrota = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      // Faz DELETE - também com Authorization automático
      await api.delete(`/frotas/${id}/`);
      setFrotas(frotas.filter(f => f.id !== id));
    } catch (err) {
      console.error('Erro ao deletar frota:', err);
      setError('Erro ao deletar frota');
    } finally {
      setLoading(false);
    }
  };

  // Enquanto está carregando autenticação
  if (authLoading) {
    return <div>Verificando autenticação...</div>;
  }

  // Se não está autenticado
  if (!user) {
    return <div>Por favor, faça login primeiro</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>Minhas Frotas</h2>
      <p>Usuário: {user.username} (ID: {user.user_id})</p>

      {error && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      {loading && <div>Carregando...</div>}

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() =>
            createFrota({
              placa: 'ABC-1234',
              modelo: 'Hyundai HB20',
              ano: 2023,
            })
          }
          disabled={loading}
        >
          Adicionar Frota de Exemplo
        </button>
      </div>

      {frotas.length === 0 ? (
        <p>Nenhuma frota cadastrada</p>
      ) : (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #000' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Placa</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Modelo</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Ano</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {frotas.map((frota) => (
              <tr key={frota.id} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '10px' }}>{frota.placa}</td>
                <td style={{ padding: '10px' }}>{frota.modelo}</td>
                <td style={{ padding: '10px' }}>{frota.ano}</td>
                <td style={{ padding: '10px' }}>
                  <button
                    onClick={() => deleteFrota(frota.id)}
                    disabled={loading}
                    style={{ color: 'red', cursor: 'pointer' }}
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr style={{ marginTop: '30px' }} />

      <h3>Como Funciona:</h3>
      <ol>
        <li>
          O `useAuth()` fornece os dados do usuário autenticado (username, user_id)
        </li>
        <li>
          Quando você usa `api.get()`, `api.post()`, etc., o header Authorization é
          injetado automaticamente pelo interceptador
        </li>
        <li>
          Se a API retornar 401, o interceptador tenta fazer refresh do token
          automaticamente
        </li>
        <li>
          Se o refresh falhar, o logout é chamado automaticamente e você é
          redirecionado para login
        </li>
      </ol>
    </div>
  );
};

export default FrotaExemplo;
