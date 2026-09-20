import { NavLink } from 'react-router-dom';
import '../css/homepageAdm.css';

export default function AdminNavbar() {
  return (
    <div className="navbar">
      <img src="/image/logo.png" alt="logo" />
      <ul>
        <li><NavLink to="/admin/usuarios" className={({ isActive }) => (isActive ? 'ativo' : undefined)}>Usuarios</NavLink></li>
        <li><NavLink to="/admin/admins" className={({ isActive }) => (isActive ? 'ativo' : undefined)}>ADMS</NavLink></li>
        <li><NavLink to="/admin/exercicios" className={({ isActive }) => (isActive ? 'ativo' : undefined)}>Exercicios</NavLink></li>
        <li><NavLink to="/admin/listas" className={({ isActive }) => (isActive ? 'ativo' : undefined)}>Listas de Treino</NavLink></li>
      </ul>
    </div>
  );
}
