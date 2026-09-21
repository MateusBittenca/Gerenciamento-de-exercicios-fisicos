import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function UserLayout() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className={'app-shell' + (menuAberto ? ' menu-aberto' : '')}>
      {menuAberto && <div className="uf-backdrop" onClick={() => setMenuAberto(false)} />}
      <Sidebar onNavigate={() => setMenuAberto(false)} />
      <div className="uf-main">
        <Topbar onMenu={() => setMenuAberto(true)} />
        <div className="uf-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
