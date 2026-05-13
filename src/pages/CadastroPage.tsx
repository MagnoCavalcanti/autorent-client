import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { AxiosError } from 'axios';

interface AuthApiError {
  detail?: string;
  username?: string[];
  non_field_errors?: string[];
}

// ─── Schema de validação ───────────────────────────────────────────────────────

const cadastroSchema = z.object({
  username: z
    .string()
    .min(3, 'Username deve ter no mínimo 3 caracteres')
    .nonempty('Username é obrigatório'),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .nonempty('Senha é obrigatória'),
  empresa: z.object({
    nome: z.string().min(2, 'Nome da empresa é obrigatório'),
    cep: z.string().min(8, 'CEP inválido'),
    telefone: z.string().min(10, 'Telefone inválido'),
    email: z.string().email('Email inválido'),
    cnpj: z.string().min(14, 'CNPJ inválido'),
  }),
});

type CadastroFormData = z.infer<typeof cadastroSchema>;

// ─── Componente ────────────────────────────────────────────────────────────────

export const CadastroPage: React.FC = () => {
  const navigate = useNavigate();
  const { registro, isAuthenticated, loading: authLoading } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
  });

  // Se já está autenticado, redireciona para dashboard
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Se está carregando autenticação, mostra loader
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CadastroFormData) => {
    try {
      setApiError(null);
      setSuccessMessage(null);
      setIsSubmitting(true);

      const result = await registro(data.username, data.password, data.empresa);

      // Se chegou aqui, registro foi sucesso
      setSuccessMessage('Cadastro realizado com sucesso! Redirecionando...');
      setTimeout(() => {
        navigate(`/${result.empresa.slug}/login`);
      }, 2000);
    } catch (error) {
      // Extrair mensagem de erro do axios
      const axiosError = error as AxiosError<AuthApiError>;
      const msg =
        axiosError?.response?.data?.detail ||
        axiosError?.response?.data?.username?.[0] ||
        axiosError?.response?.data?.non_field_errors?.[0] ||
        'Erro inesperado. Tente novamente.';

      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-2">
              Autorent
            </h1>
            <p className="text-slate-600">Crie sua conta de empresa</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-2">
                Username
              </label>
              <input
                {...register('username')}
                id="username"
                type="text"
                placeholder="Escolha um username"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.username ? 'border-red-500' : 'border-slate-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Senha
              </label>
              <input
                {...register('password')}
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.password ? 'border-red-500' : 'border-slate-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Nome da Empresa */}
            <div>
              <label
                htmlFor="empresa.nome"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Nome da Empresa
              </label>
              <input
                {...register('empresa.nome')}
                id="empresa.nome"
                type="text"
                placeholder="Nome completo da sua empresa"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.empresa?.nome ? 'border-red-500' : 'border-slate-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.empresa?.nome && (
                <p className="mt-1 text-sm text-red-600">{errors.empresa.nome.message}</p>
              )}
            </div>

            {/* CEP */}
            <div>
              <label htmlFor="empresa.cep" className="block text-sm font-medium text-slate-700 mb-2">
                CEP
              </label>
              <input
                {...register('empresa.cep')}
                id="empresa.cep"
                type="text"
                placeholder="00000000"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.empresa?.cep ? 'border-red-500' : 'border-slate-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.empresa?.cep && (
                <p className="mt-1 text-sm text-red-600">{errors.empresa.cep.message}</p>
              )}
            </div>

            {/* Telefone */}
            <div>
              <label
                htmlFor="empresa.telefone"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Telefone
              </label>
              <input
                {...register('empresa.telefone')}
                id="empresa.telefone"
                type="text"
                placeholder="11999999999"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.empresa?.telefone ? 'border-red-500' : 'border-slate-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.empresa?.telefone && (
                <p className="mt-1 text-sm text-red-600">{errors.empresa.telefone.message}</p>
              )}
            </div>

            {/* Email da Empresa */}
            <div>
              <label htmlFor="empresa.email" className="block text-sm font-medium text-slate-700 mb-2">
                Email da Empresa
              </label>
              <input
                {...register('empresa.email')}
                id="empresa.email"
                type="email"
                placeholder="contato@empresa.com"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.empresa?.email ? 'border-red-500' : 'border-slate-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.empresa?.email && (
                <p className="mt-1 text-sm text-red-600">{errors.empresa.email.message}</p>
              )}
            </div>

            {/* CNPJ */}
            <div>
              <label htmlFor="empresa.cnpj" className="block text-sm font-medium text-slate-700 mb-2">
                CNPJ
              </label>
              <input
                {...register('empresa.cnpj')}
                id="empresa.cnpj"
                type="text"
                placeholder="00000000000000"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.empresa?.cnpj ? 'border-red-500' : 'border-slate-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.empresa?.cnpj && (
                <p className="mt-1 text-sm text-red-600">{errors.empresa.cnpj.message}</p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !!successMessage}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-slate-600 text-sm">
          <p>&copy; 2026 Autorent. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default CadastroPage;
