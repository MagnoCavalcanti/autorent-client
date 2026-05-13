// App.tsx
import { Routes, Route } from 'react-router';
import Index from './pages/Index';
import LoginPage from './pages/LoginPage';
import CadastroPage from './pages/CadastroPage';
import DashboardPage from './pages/DashboardPage';
import CarrosPage from './pages/CarrosPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import Sidebar from './components/layout/Sidebar';
import ClientesPage from './pages/ClientesPage';
import VendedoresPage from './pages/VendedoresPage';
import AlugueisPage from './pages/AlugueisPage';

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
            <CarrosPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/:empresa/clientes"
        element={
          <ProtectedLayout>
            <ClientesPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/:empresa/vendedores"
        element={
          <ProtectedLayout>
            <VendedoresPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/:empresa/alugueis"
        element={
          <ProtectedLayout>
            <AlugueisPage />
          </ProtectedLayout>
        }
      />
    </Routes>
  );
}

export default App;