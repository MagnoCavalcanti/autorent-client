import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { AxiosError } from 'axios';

// ─── Schema de validação ───────────────────────────────────────────────────────

const loginSchema = z.object({
  username: z
    .string()
    .min(3, 'Username deve ter no mínimo 3 caracteres')
    .nonempty('Username é obrigatório'),
  password: z
    .string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .nonempty('Senha é obrigatória'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ─── Componente ────────────────────────────────────────────────────────────────

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
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

  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError(null);
      setIsSubmitting(true);

      await login(data.username, data.password);

      // Se chegou aqui, login foi sucesso
      navigate('/dashboard');
    } catch (error) {
      // Extrair mensagem de erro do axios
      const axiosError = error as AxiosError<any>;
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
            <p className="text-slate-600">Faça login na sua conta</p>
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
                placeholder="Seu username"
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
                placeholder="Sua senha"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                  errors.password ? 'border-red-500' : 'border-slate-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* API Error */}
            {apiError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-300"></div>
            <span className="px-3 text-sm text-slate-500">ou</span>
            <div className="flex-1 border-t border-slate-300"></div>
          </div>

          {/* Signup Link */}
          <div className="text-center">
            <p className="text-slate-600 text-sm">
              Ainda não tem conta?{' '}
              <Link
                to="/cadastro"
                className="text-blue-600 hover:text-blue-700 font-medium transition"
              >
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-slate-600 text-sm">
          <p>&copy; 2026 Autorent. Todos os direitos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
