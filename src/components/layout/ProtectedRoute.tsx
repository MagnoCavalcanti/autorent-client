import React from 'react';
import { Navigate, useLocation, useParams } from 'react-router';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

function normalizeEmpresa(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Componente para proteger rotas que requerem autenticação
 * Redireciona para /login se não estiver autenticado
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const { empresa: empresaParam } = useParams();
  const location = useLocation();

  if (loading) {
    return fallback ?? <div>Carregando...</div>;
  }

  if (!isAuthenticated || !user) {
    const loginPath = empresaParam
      ? `/${encodeURIComponent(empresaParam)}/login`
      : '/';

    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  const empresaDoToken = user.empresa;

  if (
    empresaParam &&
    empresaDoToken &&
    normalizeEmpresa(empresaParam) !== normalizeEmpresa(empresaDoToken)
  ) {
    return <Navigate to={`/${encodeURIComponent(empresaDoToken)}/dashboard`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
