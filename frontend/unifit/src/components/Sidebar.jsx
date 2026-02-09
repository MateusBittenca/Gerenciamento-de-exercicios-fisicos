import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`menu-lateral ${expanded ? 'expandido' : ''}`}>
      <div className="btn-expandir">
        <i 
          className="bi bi-list" 
          id="btn-expandir"
          onClick={() => setExpanded(!expanded)}
        ></i>
      </div>

      <ul>
        <li className={`item-menu ${isActive('/home') ? 'ativo' : ''}`}>
          <Link to="/home">
            <span className="icon"><i className="bi bi-house"></i></span>
            <span className="txt-link">Inicio</span>
          </Link>
        </li>
        <li className={`item-menu ${isActive('/exercicios') ? 'ativo' : ''}`}>
          <Link to="/exercicios">
            <span className="icon"><i className="bi bi-person-arms-up"></i></span>
            <span className="txt-link">Exercicios</span>
          </Link>
        </li>
        <li className={`item-menu ${isActive('/minhas-listas') ? 'ativo' : ''}`}>
          <Link to="/minhas-listas">
            <span className="icon"><i className="bi bi-card-list"></i></span>
            <span className="txt-link">Minhas Listas</span>
          </Link>
        </li>
        <li className={`item-menu ${isActive('/listas') ? 'ativo' : ''}`}>
          <Link to="/listas">
            <span className="icon"><i className="bi bi-filter-square-fill"></i></span>
            <span className="txt-link">Listas</span>
          </Link>
        </li>
        <li className={`item-menu ${isActive('/configuracoes') ? 'ativo' : ''}`}>
          <Link to="/configuracoes">
            <span className="icon"><i className="bi bi-gear"></i></span>
            <span className="txt-link">Configurações</span>
          </Link>
        </li>
        <li className={`item-menu ${isActive('/usuario') ? 'ativo' : ''}`}>
          <Link to="/usuario">
            <span className="icon"><i className="bi bi-person-circle"></i></span>
            <span className="txt-link">
              <div id="divUsuario" className="dados-usuario">
                {user?.nome || 'Usuário'}
              </div>
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;
