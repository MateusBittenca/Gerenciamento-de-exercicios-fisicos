import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import PageFade from '../components/PageFade';

export default function UserLayout() {
  const [menuAberto, setMenuAberto] = useState(false);
  const { refreshSessao, sessaoAtiva } = useAuth();

  useEffect(() => {
    refreshSessao();
  }, [refreshSessao]);

  useEffect(() => {
    if (!sessaoAtiva || !sessaoAtiva.sessao) {
      return undefined;
    }
    const id = setInterval(() => refreshSessao(), 4000);
    return () => clearInterval(id);
  }, [sessaoAtiva, refreshSessao]);

  return (
    <div className={'app-shell' + (menuAberto ? ' menu-aberto' : '')}>
      {menuAberto && <div className="uf-backdrop" onClick={() => setMenuAberto(false)} />}
      <Sidebar onNavigate={() => setMenuAberto(false)} />
      <div className="uf-main">
        <Topbar onMenu={() => setMenuAberto(true)} />
        <div className="uf-content">
          <PageFade />
        </div>
      </div>
    </div>
  );
}
