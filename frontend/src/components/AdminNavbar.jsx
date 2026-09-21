import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const LINKS = [
  { to: '/admin/usuarios', label: 'Usuários', icon: 'group' },
  { to: '/admin/admins', label: 'Administradores', icon: 'admin_panel_settings' },
  { to: '/admin/exercicios', label: 'Exercícios', icon: 'fitness_center' },
  { to: '/admin/listas', label: 'Listas de Treino', icon: 'assignment' }
];

export default function AdminNavbar({ onNavigate }) {
  const { logout } = useAuth();

  return (
    <aside className="uf-sidebar">
      <div>
        <div className="uf-sidebar-brand">
          <img src="/image/logo.png" alt="UniFit" />
          <div>
            <strong>UniFit</strong>
            <span>Portal Admin</span>
          </div>
        </div>
        <nav>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => 'uf-nav-link' + (isActive ? ' ativo' : '')}
              onClick={onNavigate}
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="uf-sidebar-foot">
        <NavLink to="/" className="uf-logout" onClick={logout}>
          <span className="material-symbols-outlined">logout</span>
          Sair
        </NavLink>
      </div>
    </aside>
  );
}
