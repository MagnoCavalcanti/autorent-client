// App.tsx
import { Routes, Route } from 'react-router';
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <Sidebar />
        <main className="min-h-screen md:pl-64">{children}</main>
      </div>
    </ProtectedRoute>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-zinc-400">Tela em construção.</p>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/:empresa/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<CadastroPage />} />
      <Route
        path="/:empresa/dashboard"
        element={
          <ProtectedLayout>
            <DashboardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/:empresa/carros"
        element={
          <ProtectedLayout>
            <PlaceholderPage title="Carros" />
          </ProtectedLayout>
        }
      />
      <Route
        path="/:empresa/clientes"
        element={
          <ProtectedLayout>
            <PlaceholderPage title="Clientes" />
          </ProtectedLayout>
        }
      />
      <Route
        path="/:empresa/vendedores"
        element={
          <ProtectedLayout>
            <PlaceholderPage title="Vendedores" />
          </ProtectedLayout>
        }
      />
      <Route
        path="/:empresa/alugueis"
        element={
          <ProtectedLayout>
            <PlaceholderPage title="Aluguéis" />
          </ProtectedLayout>
        }
      />
    </Routes>
  );
}

export default App;