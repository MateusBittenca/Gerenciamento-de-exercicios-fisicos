import { useState } from 'react';
import AdminNavbar from '../components/AdminNavbar';
import Topbar from '../components/Topbar';
import PageFade from '../components/PageFade';

export default function AdminLayout() {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className={'app-shell' + (menuAberto ? ' menu-aberto' : '')}>
      {menuAberto && <div className="uf-backdrop" onClick={() => setMenuAberto(false)} />}
      <AdminNavbar onNavigate={() => setMenuAberto(false)} />
      <div className="uf-main">
        <Topbar onMenu={() => setMenuAberto(true)} />
        <div className="uf-content">
          <PageFade />
        </div>
      </div>
    </div>
  );
}
