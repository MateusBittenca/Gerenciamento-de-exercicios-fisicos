import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const LINKS = [
  { to: '/app', label: 'Início', icon: 'home', end: true },
  { to: '/app/exercicios', label: 'Catálogo de Exercícios', icon: 'fitness_center' },
  { to: '/app/listas', label: 'Listas Oficiais', icon: 'assignment' },
  { to: '/app/minhas-listas', label: 'Minhas Listas', icon: 'list_alt' },
  { to: '/app/perfil', label: 'Perfil', icon: 'person' }
];

export default function Sidebar({ onNavigate }) {
  const { logout } = useAuth();

  return (
    <aside className="uf-sidebar">
      <div>
        <div className="uf-sidebar-brand">
          <img src="/image/logo.png" alt="UniFit" />
          <div>
            <strong>UniFit</strong>
            <span>Portal do Aluno</span>
          </div>
        </div>
        <nav>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
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
