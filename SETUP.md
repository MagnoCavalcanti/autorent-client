# ✅ AuthContext Setup - Autorent B2B

## 📦 Arquivos Criados

### 1. **src/types/auth.ts**
Tipagens TypeScript para autenticação:
- `LoginRequest`, `LoginResponse`
- `RegistroRequest`, `RegistroResponse`
- `RefreshTokenRequest`, `RefreshTokenResponse`
- `User` (com username, user_id, iat, exp)
- `AuthContextType` (interface do contexto)

### 2. **src/services/api.ts**
Configuração do Axios com interceptadores:
- Base URL: `http://localhost:8000/api/v1`
- **Request Interceptor**: Injeta `Authorization: Bearer {token}`
- **Response Interceptor**: 
  - Trata erros 401 automaticamente
  - Tenta refresh do token
  - Implementa fila para evitar race conditions
  - Logout automático se refresh falhar

### 3. **src/contexts/AuthContext.tsx**
Context Provider de autenticação:
- **Estado**: `user`, `loading`
- **Métodos**:
  - `login(username, password)` → Chamada a `/auth/login/`
  - `registro(username, password, nome_empresa)` → Chamada a `/auth/registro/`
  - `logout()` → Limpa tokens e estado
  - `refreshToken()` → Chamada a `/auth/token/refresh/`
- **Funcionalidades**:
  - Extrai user do JWT com `jwt-decode`
  - Salva tokens no localStorage
  - Verifica tokens na inicialização
  - Atualiza header do axios

### 4. **src/hooks/useAuth.ts**
Hook para consumir o contexto:
```tsx
const { user, loading, isAuthenticated, login, logout, registro, refreshToken } = useAuth()
```

### 5. **src/components/ProtectedRoute.tsx**
Componente para proteger rotas:
```tsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

### 6. **src/services/examples.ts**
Exemplos de serviços usando a API:
- `frotoService` - CRUD de frotas
- `reservasService` - CRUD de reservas
- `clientesService` - CRUD de clientes

### 7. **Arquivos de Documentação**
- `AUTH_README.md` - Guia completo de uso
- `SETUP.md` - Este arquivo

## 🔧 Instalação

### 1. Dependências
Certifique-se de ter instalado:
```bash
npm install axios jwt-decode
npm install --save-dev @types/jwt-decode
```

### 2. Integração com App
O `src/main.tsx` já foi atualizado para envolver o App com `AuthProvider`.

## 🚀 Como Usar

### Exemplo 1: Componente com Autenticação
```tsx
import { useAuth } from './hooks/useAuth'

function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div>
      <h1>Bem-vindo, {user?.username}!</h1>
      <button onClick={logout}>Sair</button>
    </div>
  )
}
```

### Exemplo 2: Componente de Login
```tsx
import { useAuth } from './hooks/useAuth'

function LoginForm() {
  const { login, loading } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(username, password)
      // Redirecionar
    } catch (err) {
      console.error('Erro:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={username} 
        onChange={(e) => setUsername(e.target.value)}
      />
      <input 
        type="password"
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
```

### Exemplo 3: Rota Protegida
```tsx
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  )
}
```

### Exemplo 4: Usar Serviço API
```tsx
import { frotoService } from './services/examples'
import { useEffect, useState } from 'react'

function FrotasList() {
  const [frotas, setFrotas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFrotas = async () => {
      try {
        const data = await frotoService.listar()
        setFrotas(data)
      } catch (error) {
        console.error('Erro:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFrotas()
  }, [])

  if (loading) return <div>Carregando...</div>
  
  return (
    <ul>
      {frotas.map(frota => (
        <li key={frota.id}>{frota.nome}</li>
      ))}
    </ul>
  )
}
```

## 🔐 Fluxo de Tokens

```
1. User faz login
   ↓
2. API retorna access_token e refresh_token
   ↓
3. Tokens são salvos no localStorage
   ↓
4. User extraído do JWT e salvo no contexto
   ↓
5. Próximas requisições incluem Authorization header
   ↓
6. Se 401, tenta refresh automaticamente
   ↓
7. Se refresh falha, faz logout e redireciona para /login
```

## 📋 Checklist de Implementação

- [x] Tipos TypeScript criados
- [x] Axios configurado com interceptadores
- [x] AuthContext implementado
- [x] Hook useAuth criado
- [x] main.tsx envolvido com AuthProvider
- [x] ProtectedRoute criada
- [x] Exemplos de serviços
- [x] Documentação completa

## ⚠️ Notas Importantes

1. **localStorage**: Tokens são salvos no localStorage. Para produção, considere usar httpOnly cookies
2. **CORS**: Certifique-se que o backend está configurado para CORS
3. **Refresh Loop**: O interceptador evita loops infinitos de refresh com uma fila de requisições
4. **Redirecionamento**: Ao falhar refresh, redireciona para `/login`
5. **Estado Loading**: Use para mostrar spinners enquanto verifica tokens na inicialização

## 🧪 Testando

```tsx
// No seu componente App ou teste
import { useAuth } from './hooks/useAuth'

function TestAuth() {
  const { user, loading, isAuthenticated } = useAuth()

  return (
    <div>
      <p>Loading: {loading.toString()}</p>
      <p>Autenticado: {isAuthenticated.toString()}</p>
      <p>Usuário: {user?.username || 'Nenhum'}</p>
    </div>
  )
}
```

## 📚 Estrutura Final do Projeto

```
src/
├── components/
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   └── useAuth.ts
├── services/
│   ├── api.ts
│   └── examples.ts
├── types/
│   └── auth.ts
├── App.tsx
└── main.tsx (ATUALIZADO)
```

## ✨ Próximos Passos

1. Criar página de login (`/login`)
2. Criar página de registro (`/register`)
3. Criar dashboard protegida
4. Implementar rotas com React Router
5. Criar mais serviços específicos conforme necessário
