export interface LoginRequest {
  username: string;
  password: string;
  empresa?: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface EmpresaRequest {
  nome: string;
  cep: string;
  telefone: string;
  email: string;
  cnpj: string;
}

export interface RegistroRequest {
  username: string;
  password: string;
  empresa: EmpresaRequest;
}

export interface RegistroResponse {
  message: string;
  usuario: {
    username: string;
  };
  empresa: {
    nome: string;
    slug: string;
  };
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

export interface User {
  username: string;
  user_id: number;
  iat?: number;
  exp?: number;
  empresa?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string, empresa?: string) => Promise<void>;
  logout: () => void;
  registro: (
    username: string,
    password: string,
    empresa: EmpresaRequest
  ) => Promise<RegistroResponse>;
  refreshToken: () => Promise<boolean>;
}
