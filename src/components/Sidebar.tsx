import { useEffect, useMemo, useState } from 'react';
import { NavLink, useParams } from 'react-router';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import {
  Car,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCheck,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';




const expandedWidth = 'w-64';
const collapsedWidth = 'w-20';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { empresa } = useParams<{ empresa: string }>();
  const [empresaNome, setEmpresaNome] = useState<string>(empresa ?? ''); // ← adicionar

  // Remover o navItems estático do topo do arquivo e montar aqui dentro:
  const navItems = useMemo(() => [
    { to: `/${empresa}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { to: `/${empresa}/carros`, label: 'Carros', icon: Car },
    { to: `/${empresa}/clientes`, label: 'Clientes', icon: Users },
    { to: `/${empresa}/vendedores`, label: 'Vendedores', icon: UserCheck },
    { to: `/${empresa}/alugueis`, label: 'Aluguéis', icon: ClipboardList },
  ], [empresa]);
  
  
  useEffect(() => {
    if (!empresa) return;
  
    api.get(`/empresas/${empresa}/`)
      .then((res) => setEmpresaNome(res.data.nome))
      .catch(() => setEmpresaNome(empresa)); // fallback para o slug se falhar
  }, [empresa]);
  


  const widthClass = collapsed ? collapsedWidth : expandedWidth;
  const username = user?.username ?? 'Usuário';

  return (
    <>
      <Button
        variant="secondary"
        aria-label="Abrir menu"
        size="icon"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-[60] border border-zinc-700 bg-zinc-900 text-zinc-100 md:hidden"
      >
        <Menu size={18} />
      </Button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={[
          'fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-zinc-800 bg-zinc-900 text-zinc-100',
          widthClass,
          'transition-all duration-300 ease-in-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-3 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/90 text-white">
              <Car size={18} />
            </div>
            {!collapsed && <span className="text-lg font-bold tracking-tight">AutoRent</span>}
          </div>

          <Button
            size="icon"
            variant="secondary"
            aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden text-zinc-300 hover:text-white md:inline-flex"
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </Button>
        </div>

        <div className="px-3 pb-4">
          <div className="rounded-lg bg-zinc-800/70 px-3 py-2">
            {!collapsed && (
              <>
                <p className="text-xs uppercase tracking-wide text-zinc-400">Empresa</p>
                <p className="truncate text-sm font-medium text-zinc-100">{empresaNome}</p>
              </>
            )}
            {collapsed && (
              <p
                title={empresaNome}
                className="truncate text-center text-xs font-medium text-zinc-200"
              >
                EMP
              </p>
            )}
          </div>
        </div>

        <Separator className="bg-zinc-800" />

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ to, label, icon: Icon }) => {
            const link = (
              <NavLink
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  [
                    'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    collapsed ? 'justify-center' : 'gap-3',
                    isActive
                      ? 'bg-blue-500/20 text-blue-200 ring-1 ring-blue-500/40'
                      : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100',
                  ].join(' ')
                }
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            );

            if (collapsed) {
              return (
                <div key={to} title={label}>
                  {link}
                </div>
              );
            }

            return <div key={to}>{link}</div>;
          })}
        </nav>

        <Separator className="bg-zinc-800" />

        <div className="space-y-2 px-3 py-4">
          <div
            className={[
              'rounded-lg bg-zinc-800/70 px-3 py-2',
              collapsed ? 'text-center' : '',
            ].join(' ')}
          >
            <p className="truncate text-xs uppercase tracking-wide text-zinc-400">Usuário</p>
            {!collapsed && <p className="truncate text-sm font-medium text-zinc-100">{username}</p>}
            {collapsed && (
              <p
                title={username}
                className="truncate text-xs font-semibold text-zinc-100"
              >
                {username.slice(0, 2).toUpperCase()}
              </p>
            )}
          </div>

          {collapsed ? (
            <Button
              size="icon"
              variant="secondary"
              aria-label="Sair"
              title="Sair"
              onClick={logout}
              className="w-full"
            >
              <LogOut size={16} />
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={logout}
              className="w-full justify-start"
            >
              Sair
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;