import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { formatCronometro, segundosDesde } from '../api/client';

const LINKS = [
  { to: '/app', label: 'Início', icon: 'home', end: true },
  { to: '/app/exercicios', label: 'Catálogo de Exercícios', icon: 'fitness_center' },
  { to: '/app/listas', label: 'Listas Oficiais', icon: 'verified' },
  { to: '/app/minhas-listas', label: 'Minhas Listas', icon: 'playlist_add_check' },
  { to: '/app/perfil', label: 'Perfil', icon: 'person' }
];

export default function Sidebar({ onNavigate }) {
  const { logout, sessaoAtiva } = useAuth();
  const navigate = useNavigate();
  const [, setTick] = useState(0);
  const sessao = sessaoAtiva && sessaoAtiva.sessao;
  const [vistoEm] = useState(() => Date.now());

  useEffect(() => {
    if (!sessao || sessao.status !== 'em_andamento') {
      return undefined;
    }
    const id = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, [sessao]);

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
        {sessao && sessao.status === 'em_andamento' && (
          <button
            type="button"
            className="uf-treino-ativo"
            onClick={() => { onNavigate && onNavigate(); navigate('/app/treino/' + sessao.id); }}
          >
            <span className="material-symbols-outlined">timer</span>
            <span>
              <small>Treino Ativo</small>
              <strong>{formatCronometro(Math.max(segundosDesde(sessao.iniciada_em), Math.floor((Date.now() - vistoEm) / 1000)))}</strong>
            </span>
            <i />
          </button>
        )}
        <NavLink to="/" className="uf-logout" onClick={logout}>
          <span className="material-symbols-outlined">logout</span>
          Sair
        </NavLink>
      </div>
    </aside>
  );
}
