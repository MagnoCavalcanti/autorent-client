# 🔑 Páginas de Login e Cadastro - Integração

## 📦 Arquivos Criados

1. **src/pages/LoginPage.tsx** - Página de login
2. **src/pages/CadastroPage.tsx** - Página de cadastro

## 🔧 Como Integrar com React Router

### Passo 1: Criar arquivo de rotas

Crie `src/routes/index.tsx`:

```tsx
import { createBrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import CadastroPage from '../pages/CadastroPage';
import DashboardPage from '../pages/DashboardPage'; // criar depois
import ProtectedRoute from '../components/ProtectedRoute';
import IndexPage from '../pages/index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <IndexPage />, // Landing page
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/cadastro',
    element: <CadastroPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
]);
```

### Passo 2: Usar no App.tsx

```tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

### Passo 3: Verificar main.tsx

Certifique-se que está assim (deve estar, já que adicionamos AuthProvider):

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import AuthProvider from './contexts/AuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
```

## 📋 Funcionalidades Implementadas

### LoginPage
✅ Formulário com username e password
✅ Validação com Zod (username ≥ 3 chars, password ≥ 6 chars)
✅ Integração com `useAuth().login()`
✅ Tratamento de erros da API
✅ Estado de loading no botão
✅ Link para cadastro
✅ Redireção para dashboard após sucesso
✅ Redireção para dashboard se já autenticado

### CadastroPage
✅ Formulário com username, password e nome_empresa
✅ Validação com Zod (nome_empresa ≥ 2 chars)
✅ Integração com `useAuth().registro()`
✅ Tratamento de erros (incluindo username duplicado)
✅ Estado de loading no botão
✅ Mensagem de sucesso
✅ Redireção automática para login após sucesso (2s)
✅ Link para login
✅ Redireção para dashboard se já autenticado

## 🎨 Estilos

Ambas as páginas usam **Tailwind CSS** com:
- Gradientes azuis (tema Autorent)
- Design responsivo mobile-first
- Cards com sombra
- Inputs com validação visual (borda vermelha em erro)
- Botões com hover effects e estados disabled

## 🔐 Tratamento de Erros da API

```ts
const msg =
  error?.response?.data?.detail ||
  error?.response?.data?.username?.[0] ||
  error?.response?.data?.non_field_errors?.[0] ||
  'Erro inesperado. Tente novamente.';
```

Exemplos de erros tratados:
- `detail`: Mensagem genérica da API
- `username.[0]`: "Username já existe" ou validação do username
- `non_field_errors.[0]`: "Invalid credentials" no login

## 📱 Responsividade

Ambas as páginas são totalmente responsivas:
- Desktop: Card centralizado
- Mobile: Card com padding lateral
- Todos os inputs têm tamanho adequado para mobile

## 🧪 Testando Localmente

1. **Instale as dependências:**
```bash
npm install
```

2. **Configure as rotas no App.tsx**

3. **Inicie o servidor:**
```bash
npm run dev
```

4. **Acesse:**
```
http://localhost:5173/login
http://localhost:5173/cadastro
```

## 📦 Dependências Usadas

- `react-hook-form` - Gerenciamento de formulários
- `zod` - Validação de schemas
- `@hookform/resolvers` - Integração Zod com React Hook Form
- `react-router-dom` - Navegação entre páginas
- `tailwindcss` - Estilos (já instalado)
- `axios` - Requisições HTTP (já instalado)

## 🎯 Fluxo de Autenticação

### Login
```
Usuário preenche form
         ↓
Valida com Zod
         ↓
Se válido: Chamar login()
         ↓
API retorna tokens
         ↓
Tokens salvos em localStorage
         ↓
User extraído do JWT
         ↓
Redireciona para /dashboard
```

### Cadastro
```
Usuário preenche form
         ↓
Valida com Zod
         ↓
Se válido: Chamar registro()
         ↓
API retorna sucesso/erro
         ↓
Se sucesso: Mostra mensagem
         ↓
Aguarda 2 segundos
         ↓
Redireciona para /login
         ↓
User pode fazer login
```

## 🚀 Próximos Passos

1. Criar página de dashboard (`DashboardPage.tsx`)
2. Configurar rotas com React Router
3. Criar componentes de listagem de frotas/reservas
4. Implementar sidebar de navegação

## ⚠️ Notas Importantes

- As páginas só aparecem se **não** estiver autenticado (senão redireciona para dashboard)
- A validação é feita no frontend (Zod) e no backend (API)
- Erros de API são capturados e exibidos de forma amigável
- O botão fica desabilitado enquanto aguarda resposta
- Mensagens de sucesso desaparecem após 2 segundos automaticamente
