# Autorent Client

Aplicação frontend de gerenciamento de locadora de veículos construída com React, TypeScript e Vite.

## Visão geral

`autorent-client` é uma interface administrativa para empresas de locação de carros. A aplicação oferece autenticação JWT, dashboard com métricas, cadastros e gerenciamento de registros de carros, clientes, vendedores e aluguéis.

## Principais funcionalidades

- Autenticação com login, armazenamento de `access` e `refresh token` em `localStorage`
- Proteção de rotas privadas via `ProtectedRoute`
- Dashboard com navegação corporativa para empresas
- CRUD para:
  - carros
  - clientes
  - vendedores
  - aluguéis
- Filtros de pesquisa e tabelas com edição e exclusão
- Renovação automática de token quando expira
- Uso de formulários e validação com `react-hook-form` e `zod`

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- react-hook-form
- Zod
- Lucide React
- JWT Decode
- ESLint

## Estrutura do projeto

- `src/App.tsx` - definição das rotas e layout protegido
- `src/main.tsx` - bootstrap da aplicação
- `src/contexts/AuthContext.tsx` - contexto de autenticação e refresh token
- `src/services/api.ts` - instância Axios com interceptors de auth
- `src/pages/` - páginas do sistema
- `src/components/` - componentes reutilizáveis e modais
- `src/types/` - tipos TypeScript para dados de negócio

## Variáveis de ambiente

A aplicação depende de uma variável de ambiente para a URL da API:

- `VITE_API_URL` - endpoint base do backend

No Vite, crie um arquivo `.env` na raiz do projeto com o conteúdo:

```env
VITE_API_URL=https://seu-backend.example.com/api
```

## Executando localmente

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Acesse a aplicação no navegador através da URL exibida pelo Vite, normalmente `http://localhost:5173`.

## Scripts disponíveis

- `npm run dev` - inicia o servidor Vite em modo de desenvolvimento
- `npm run build` - gera o build de produção
- `npm run preview` - executa um servidor estático para pré-visualizar o build
- `npm run lint` - executa o ESLint para verificar problemas de código

## Rotas principais

- `/` - página inicial
- `/:empresa/login` - login da empresa
- `/cadastro` - cadastro de empresa/usuário
- `/:empresa/dashboard` - dashboard após login
- `/:empresa/carros` - gestão de carros
- `/:empresa/clientes` - gestão de clientes
- `/:empresa/vendedores` - gestão de vendedores
- `/:empresa/alugueis` - gestão de aluguéis

## Requisitos do backend

A aplicação espera uma API compatível com autenticação JWT, endpoints para login, refresh token e recursos REST:

- `POST /auth/login/`
- `POST /auth/token/refresh/`
- `POST /auth/registro/`
- `GET|POST|PATCH|DELETE /:empresa/carros/`
- `GET|POST|PATCH|DELETE /:empresa/clientes/`
- `GET|POST|PATCH|DELETE /:empresa/vendedores/`
- `GET|POST|PATCH|DELETE /:empresa/alugueis/`

## Boas práticas

- Use `typescript` para tipos fortes em dados de API
- Centralize a lógica de autenticação em `AuthContext`
- Mantenha os interceptors Axios para renovação de token
- Faça componentes UI reutilizáveis para modal, tabela e formulário

## Contribuição

1. Faça um fork do repositório
2. Crie uma branch com a feature ou correção (`git checkout -b feature/nome`)
3. Faça commit das alterações (`git commit -m "Descrição da mudança"`)
4. Envie para o repositório remoto (`git push origin feature/nome`)

## Licença

Distribuído sob a licença MIT.
