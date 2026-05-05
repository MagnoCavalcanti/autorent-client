import { useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router';
import {
  KeyRound,
  Users,
  UserCheck,
  Car,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const navItems = [
  { label: 'Aluguéis',   icon: KeyRound,   path: '/dashboard/alugueis' },
  { label: 'Clientes',   icon: Users,      path: '/dashboard/clientes' },
  { label: 'Vendedores', icon: UserCheck,  path: '/dashboard/vendedores' },
  { label: 'Frota',      icon: Car,        path: '/dashboard/frota' },
];

function Tooltip({ label, children, disabled }: { label: string; children: React.ReactNode; disabled?: boolean }) {
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(0);

  const show = () => {
    if (disabled) return;
    timer.current = setTimeout(() => setVisible(true), 300);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setVisible(false);
  };

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50 pointer-events-none">
          <div className="bg-slate-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
            {label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? 'AU';

  return (
    <aside
      style={{ width: collapsed ? 72 : 240, transition: 'width 0.25s ease' }}
      className="relative flex flex-col h-screen bg-white border-r border-slate-200 overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-slate-100">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
            <Car size={18} className="text-white" />
          </div>
          {!collapsed && (
            <span className="text-xl font-black text-slate-900 whitespace-nowrap">
              Autorent
            </span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-hidden">
        {navItems.map(({ label, icon: Icon, path }) => (
          <Tooltip key={path} label={label} disabled={!collapsed}>
            <NavLink
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group w-full
                ${isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    className={`flex-shrink-0 transition ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </Tooltip>
        ))}
      </nav>

      {/* Footer / User */}
      <div className="border-t border-slate-100 p-3 flex flex-col gap-1">
        <Tooltip label={user?.username ?? ''} disabled={!collapsed}>
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 transition cursor-default">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
              {initials}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {user?.username}
                </p>
                <p className="text-xs text-slate-400">Administrador</p>
              </div>
            )}
          </div>
        </Tooltip>

        <Tooltip label="Sair" disabled={!collapsed}>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition w-full ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!collapsed && (
              <span className="text-sm font-medium whitespace-nowrap">Sair</span>
            )}
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}