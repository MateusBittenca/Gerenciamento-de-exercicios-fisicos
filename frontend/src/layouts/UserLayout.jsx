import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function UserLayout() {
  return (
    <div className="banner app-user">
      <Sidebar />
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  );
}
