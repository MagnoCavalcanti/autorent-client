# AuthContext para Autorent B2B

Sistema completo de autenticação com React Context, TypeScript e Axios para gerenciamento de tokens JWT.

## 📁 Estrutura de Arquivos

```
src/
├── contexts/
│   └── AuthContext.tsx         # Contexto de autenticação com toda lógica
├── services/
│   └── api.ts                  # Configuração do axios com interceptores
├── hooks/
│   └── useAuth.ts              # Hook para consumir o contexto
└── types/
    └── auth.ts                 # Tipagens TypeScript
```

## 🚀 Como Usar

### 1. Envolver a aplicação com AuthProvider

No arquivo `src/main.tsx`:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import AuthProvider from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
```

### 2. Usar o hook useAuth em componentes

```tsx
import { useAuth } from './hooks/useAuth'

export function MyComponent() {
  const { user, isAuthenticated, loading, login, logout } = useAuth()

  if (loading) {
    return <div>Carregando...</div>
  }

  if (!isAuthenticated) {
    return <div>Não autenticado</div>
  }

  return (
    <div>
      <p>Bem-vindo, {user?.username}!</p>
      <button onClick={() => logout()}>Sair</button>
    </div>
  )
}
```

### 3. Exemplo de Login

```tsx
import { useAuth } from './hooks/useAuth'

export function LoginForm() {
  const { login, loading } = useAuth()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(username, password)
      // Redirecionar para dashboard
    } catch (err) {
      setError('Falha na autenticação')
    }
  }

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
      {error && <p>{error}</p>}
    </form>
  )
}
```

### 4. Exemplo de Registro

```tsx
import { useAuth } from './hooks/useAuth'

export function RegistroForm() {
  const { registro, loading } = useAuth()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [nome_empresa, setNomeEmpresa] = React.useState('')
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await registro(username, password, nome_empresa)
      setSuccess('Cadastro realizado com sucesso!')
      // Redirecionar para login
    } catch (err) {
      setError('Falha no cadastro')
    }
  }

  return (
    <form onSubmit={handleRegistro}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      <input
        type="text"
        value={nome_empresa}
        onChange={(e) => setNomeEmpresa(e.target.value)}
        placeholder="Nome da Empresa"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
      {error && <p>{error}</p>}
      {success && <p>{success}</p>}
    </form>
  )
}
```

## 🔐 Funcionalidades

### Estado do Contexto

```typescript
interface AuthContextType {
  user: User | null;              // Dados do usuário logado (username, user_id)
  loading: boolean;               // Indicador de carregamento
  isAuthenticated: boolean;       // Se há um usuário autenticado
  login: (username, password) => Promise<void>;
  logout: () => void;
  registro: (username, password, nome_empresa) => Promise<void>;
  refreshToken: () => Promise<boolean>;
}
```

### Tokens

- **access_token**: Token JWT curto (salvo no localStorage)
- **refresh_token**: Token para renovar o access_token (salvo no localStorage)

### Interceptadores do Axios

1. **Request Interceptor**: Injeta `Authorization: Bearer {access_token}` em todas as requisições
2. **Response Interceptor**: 
   - Se retornar 401, tenta fazer refresh do token automaticamente
   - Se o refresh falhar, faz logout e redireciona para `/login`
   - Implementa fila de requisições para evitar condições de corrida

## 📋 Requisitos Instalados

Certifique-se de ter as dependências instaladas:

```bash
npm install axios jwt-decode
npm install --save-dev @types/jwt-decode
```

## 🔄 Fluxo de Autenticação

1. **App monta** → AuthProvider verifica tokens no localStorage
2. **User não autenticado** → Tenta refresh se houver refresh_token
3. **User faz login** → Tokens são salvos no localStorage
4. **Requisição é feita** → Axios injeta Authorization header
5. **Resposta 401** → Axios tenta refresh automaticamente
6. **User faz logout** → Tokens são removidos e contexto é resetado

## ⚠️ Notas Importantes

- O contexto deve envolver toda a aplicação para funcionar corretamente
- Use o hook `useAuth` apenas dentro de componentes filhos do AuthProvider
- Os tokens são salvos no localStorage (considere usar httpOnly cookies em produção)
- O interceptor de 401 redireciona para `/login` quando falha
