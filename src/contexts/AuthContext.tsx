import React, {
  createContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import type {
  AuthContextType,
  User,
  LoginRequest,
  RegistroRequest,
} from '../types/auth';

// ─── Tipos internos ────────────────────────────────────────────────────────────

interface JwtPayload {
  username: string;
  user_id: number;
  iat: number;
  exp: number;
}

// ─── Context ──────────────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

const KEYS = { access: 'access_token', refresh: 'refresh_token' } as const;

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // loading só é true durante o boot inicial (verificar localStorage)
  const [loading, setLoading] = useState(true);

  // Evita múltiplos refreshes simultâneos
  const refreshPromiseRef = useRef<Promise<boolean> | null>(null);

  // ── Helpers ─────────────────────────────────────────────────────────────────

  const extractUserFromToken = useCallback((token: string): User | null => {
    try {
      // FIX: tipagem correta em vez de <any>
      const decoded = jwtDecode<JwtPayload>(token);
      return {
        username: decoded.username,
        user_id: decoded.user_id,
        iat: decoded.iat,
        exp: decoded.exp,
      };
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  }, []);

  // ── Logout (declarado antes de refreshTokenFn para ser usado como dep) ───────

  // FIX: declarado com useCallback sem deps para ser estável (não muda referência)
  const logout = useCallback(() => {
    localStorage.removeItem(KEYS.access);
    localStorage.removeItem(KEYS.refresh);
    setUser(null);
  }, []);

  // ── Refresh Token ────────────────────────────────────────────────────────────

  const refreshTokenFn = useCallback(async (): Promise<boolean> => {
    // FIX: se já há um refresh em andamento, aguarda o mesmo (evita race condition)
    if (refreshPromiseRef.current) return refreshPromiseRef.current;

    refreshPromiseRef.current = (async () => {
      try {
        // FIX: renomeado para "storedRefresh" — antes chamava "refreshToken"
        // que conflitava com a string do localStorage (não com a função)
        const storedRefresh = localStorage.getItem(KEYS.refresh);

        if (!storedRefresh) {
          console.error('Refresh token não encontrado');
          logout();
          return false;
        }

        const response = await api.post<{ access: string }>(
          '/auth/token/refresh/',
          { refresh: storedRefresh }
        );

        const { access } = response.data;
        localStorage.setItem(KEYS.access, access);

        const userData = extractUserFromToken(access);
        setUser(userData);

        return true;
      } catch (error) {
        console.error('Erro ao fazer refresh do token:', error);
        // FIX: logout está no escopo correto pois foi declarado antes
        logout();
        return false;
      }
    })();

    try {
      return await refreshPromiseRef.current;
    } finally {
      refreshPromiseRef.current = null;
    }
    // FIX: logout incluído nas deps (antes estava ausente → stale closure)
  }, [extractUserFromToken, logout]);

  // ── Login ────────────────────────────────────────────────────────────────────

  const login = useCallback(
    async (username: string, password: string) => {
      // FIX: removido setLoading(true/false) — loading é só para boot inicial
      const response = await api.post<{ access: string; refresh: string }>(
        '/auth/login/',
        { username, password } as LoginRequest
      );

      const { access, refresh } = response.data;
      localStorage.setItem(KEYS.access, access);
      localStorage.setItem(KEYS.refresh, refresh);

      const userData = extractUserFromToken(access);
      setUser(userData);
      // FIX: removido api.defaults.headers — o interceptor abaixo cuida disso
    },
    [extractUserFromToken]
  );

  // ── Registro ─────────────────────────────────────────────────────────────────

  const registro = useCallback(
    async (username: string, password: string, nome_empresa: string) => {
      // FIX: removido setLoading(true/false) — loading é só para boot inicial
      const response = await api.post('/auth/registro/', {
        username,
        password,
        nome_empresa,
      } as RegistroRequest);

      return response.data;
    },
    []
  );

  // ── Interceptors ─────────────────────────────────────────────────────────────

  useEffect(() => {
    // FIX: interceptor centralizado em vez de setar api.defaults.headers manualmente.
    // Garante que TODAS as requisições usem o token mais recente do localStorage
    // no momento da chamada, inclusive antes do primeiro login.
    const reqId = api.interceptors.request.use(
      (config: import('axios').InternalAxiosRequestConfig) => {
        const access = localStorage.getItem(KEYS.access);
        if (access) config.headers.Authorization = `Bearer ${access}`;
        return config;
      }
    );

    const resId = api.interceptors.response.use(
      (response: import('axios').AxiosResponse) => response,
      async (
        error: import('axios').AxiosError & {
          config?: import('axios').InternalAxiosRequestConfig & {
            _retry?: boolean;
          };
        }
      ) => {
        const original = error.config;
        const is401 = error.response?.status === 401;
        const isRefreshEndpoint = original?.url?.includes('/auth/token/refresh/');

        if (is401 && !isRefreshEndpoint && !original?._retry) {
          if (original) original._retry = true;
          const ok = await refreshTokenFn();
          if (ok && original) {
            original.headers.Authorization = `Bearer ${localStorage.getItem(KEYS.access)}`;
            return api(original);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, [refreshTokenFn]);

  // ── Boot: verificar tokens salvos ────────────────────────────────────────────

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem(KEYS.access);
        const storedRefresh = localStorage.getItem(KEYS.refresh);

        if (!accessToken) return;

        const userData = extractUserFromToken(accessToken);

        if (!userData) {
          logout();
          return;
        }

        if (userData.exp && userData.exp * 1000 > Date.now()) {
          // Token ainda válido
          setUser(userData);
        } else if (storedRefresh) {
          // FIX: antes chamava "await refreshToken()" que resolvia para a string
          // do localStorage (variável local), não para a função — bug silencioso
          await refreshTokenFn();
        } else {
          logout();
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [extractUserFromToken, refreshTokenFn, logout]);

  // ── Value ────────────────────────────────────────────────────────────────────

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    registro,
    refreshToken: refreshTokenFn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;