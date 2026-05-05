export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface RegistroRequest {
  username: string;
  password: string;
  nome_empresa: string;
}

export interface RegistroResponse {
  message: string;
  usuario: {
    username: string;
    email: string;
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
  exp?: number;  // ← adicionar ?
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  registro: (username: string, password: string, nome_empresa: string) => Promise<void>;
  refreshToken: () => Promise<boolean>;
}
