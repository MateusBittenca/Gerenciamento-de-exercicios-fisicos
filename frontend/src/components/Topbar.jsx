import { useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const CRUMBS = {
  '/app': ['Início'],
  '/app/exercicios': ['Início', 'Catálogo de Exercícios'],
  '/app/listas': ['Início', 'Listas Oficiais'],
  '/app/minhas-listas': ['Início', 'Minhas Listas'],
  '/app/perfil': ['Início', 'Perfil'],
  '/admin/usuarios': ['Admin', 'Usuários'],
  '/admin/admins': ['Admin', 'Administradores'],
  '/admin/exercicios': ['Admin', 'Exercícios'],
  '/admin/listas': ['Admin', 'Listas de Treino'],
  '/admin/listas/adicionar': ['Admin', 'Listas de Treino', 'Adicionar']
};

export default function Topbar({ onMenu }) {
  const { payload, role } = useAuth();
  const { pathname } = useLocation();
  const crumbs = CRUMBS[pathname] || ['UniFit'];
  const nome = payload?.nome || 'Usuário';
  const inicial = nome.trim().charAt(0).toUpperCase();
  const papel = role === 'admin' ? 'Administrador' : 'Aluno';

  return (
    <header className="uf-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="button" className="uf-menu-btn" onClick={onMenu} aria-label="Abrir menu">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="uf-crumb">
          {crumbs.map((item, index) => (
            <span key={item + index}>
              {index > 0 && <span> / </span>}
              {index === crumbs.length - 1 ? <strong>{item}</strong> : item}
            </span>
          ))}
        </div>
      </div>
      <div className="uf-userchip">
        <div className="nome">
          <strong>{nome}</strong>
          <span>{papel}</span>
        </div>
        <div className="uf-avatar">{inicial}</div>
      </div>
    </header>
  );
}
