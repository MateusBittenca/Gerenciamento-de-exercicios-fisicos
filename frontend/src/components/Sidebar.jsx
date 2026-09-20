import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import '../css/menu-lateral.css';

export default function Sidebar() {
  const { payload, logout } = useAuth();
  const [expandir, setExpandir] = useState(false);

  return (
    <nav className={'menu-lateral' + (expandir ? ' expandir' : '')}>
      <div className="btn-expandir">
        <i className="bi bi-list" id="btn-expandir" onClick={() => setExpandir((atual) => !atual)}></i>
      </div>
      <ul>
        <li className="item-menu">
          <NavLink to="/app" end className={({ isActive }) => (isActive ? 'ativo' : undefined)}>
            <span className="icon"><i className="bi bi-house"></i></span>
            <span className="txt-link">Inicio</span>
          </NavLink>
        </li>
        <li className="item-menu">
          <NavLink to="/app/exercicios" className={({ isActive }) => (isActive ? 'ativo' : undefined)}>
            <span className="icon"><i className="bi bi-person-arms-up"></i></span>
            <span className="txt-link">Exercicios</span>
          </NavLink>
        </li>
        <li className="item-menu">
          <NavLink to="/app/minhas-listas" className={({ isActive }) => (isActive ? 'ativo' : undefined)}>
            <span className="icon"><i className="bi bi-card-list"></i></span>
            <span className="txt-link">Minhas Listas</span>
          </NavLink>
        </li>
        <li className="item-menu">
          <NavLink to="/app/listas" className={({ isActive }) => (isActive ? 'ativo' : undefined)}>
            <span className="icon"><i className="bi bi-filter-square-fill"></i></span>
            <span className="txt-link">Listas</span>
          </NavLink>
        </li>
        <li className="item-menu">
          <NavLink to="/app/perfil" className={({ isActive }) => (isActive ? 'ativo' : undefined)}>
            <span className="icon"><i className="bi bi-person-circle"></i></span>
            <span className="txt-link">
              <div id="divUsuario" className="dados-usuario">{payload?.nome}</div>
            </span>
          </NavLink>
        </li>
        <li className="item-menu">
          <NavLink to="/" id="Logout" onClick={logout}>
            <span className="icon"><i className="bi bi-box-arrow-left"></i></span>
            <span className="txt-link">Logout</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
