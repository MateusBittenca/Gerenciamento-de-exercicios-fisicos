import { useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const CRUMBS = {
  '/app': ['Painel', 'Treinamento Diário'],
  '/app/exercicios': ['Painel', 'Catálogo de Exercícios'],
  '/app/listas': ['Painel', 'Listas Oficiais'],
  '/app/minhas-listas': ['Painel', 'Minhas Listas'],
  '/app/perfil': ['Painel', 'Perfil'],
  '/admin/usuarios': ['UniFit Hub', 'Gestão de Usuários'],
  '/admin/admins': ['UniFit Hub', 'Administradores'],
  '/admin/exercicios': ['UniFit Hub', 'Catálogo de Exercícios'],
  '/admin/listas': ['UniFit Hub', 'Listas Oficiais'],
  '/admin/listas/adicionar': ['UniFit Hub', 'Listas Oficiais', 'Adicionar']
};

export default function Topbar({ onMenu }) {
  const { payload, role } = useAuth();
  const { pathname } = useLocation();
  const crumbs = pathname.startsWith('/app/treino/')
    ? ['Painel', 'Treino']
    : (CRUMBS[pathname] || ['UniFit']);
  const nome = payload?.nome || 'Usuário';
  const inicial = nome.trim().charAt(0).toUpperCase();
  const papel = role === 'admin' ? 'Administrador' : 'Aluno UniFit';
  const foto = payload?.foto;

  return (
    <header className="uf-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button type="button" className="uf-menu-btn" onClick={onMenu} aria-label="Abrir menu">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="uf-crumb">
          {crumbs.map((item, index) => (
            <span key={item + index} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              {index > 0 && <span className="material-symbols-outlined">chevron_right</span>}
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
        {foto ? (
          <img className="uf-avatar" src={foto} alt={nome} />
        ) : (
          <div className="uf-avatar">{inicial}</div>
        )}
      </div>
    </header>
  );
}
