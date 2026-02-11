import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: 'speedometer2',
      label: 'Dashboard'
    },
    {
      path: '/admin/usuarios',
      icon: 'people',
      label: 'Usuários'
    },
    {
      path: '/admin/exercicios',
      icon: 'clipboard-heart',
      label: 'Exercícios'
    },
    {
      path: '/admin/listas',
      icon: 'list-check',
      label: 'Listas'
    },
    {
      path: '/admin/admins',
      icon: 'shield-check',
      label: 'Administradores'
    },
    {
      path: '/admin/logs',
      icon: 'clock-history',
      label: 'Logs'
    },
    {
      path: '/admin/relatorios',
      icon: 'file-earmark-bar-graph',
      label: 'Relatórios'
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login-admin');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className={`admin-sidebar ${collapsed ? 'admin-sidebar--collapsed' : ''}`}>
      <div className="admin-sidebar__header">
        <div className="admin-sidebar__brand">
          <div className="admin-sidebar__logo">
            <i className="bi bi-lightning-charge-fill"></i>
          </div>
          {!collapsed && (
            <span className="admin-sidebar__brand-text">Unifit Admin</span>
          )}
        </div>
        <button 
          className="admin-sidebar__toggle"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expandir' : 'Recolher'}
        >
          <i className={`bi bi-chevron-${collapsed ? 'right' : 'left'}`}></i>
        </button>
      </div>

      <nav className="admin-sidebar__nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-sidebar__link ${isActive(item.path) ? 'admin-sidebar__link--active' : ''}`}
            title={collapsed ? item.label : ''}
          >
            <i className={`bi bi-${item.icon} admin-sidebar__icon`}></i>
            {!collapsed && <span className="admin-sidebar__label">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <div className="admin-sidebar__user">
          <div className="admin-sidebar__user-avatar">
            <i className="bi bi-person-circle"></i>
          </div>
          {!collapsed && (
            <div className="admin-sidebar__user-info">
              <p className="admin-sidebar__user-name">{user?.Nome}</p>
              <p className="admin-sidebar__user-role">Administrador</p>
            </div>
          )}
        </div>
        <button 
          className="admin-sidebar__logout"
          onClick={handleLogout}
          title="Sair"
        >
          <i className="bi bi-box-arrow-right"></i>
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
