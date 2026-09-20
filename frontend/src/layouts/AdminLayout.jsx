import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminLayout() {
  return (
    <div className="banner app-admin">
      <AdminNavbar />
      <main className="conteudo-admin">
        <Outlet />
      </main>
    </div>
  );
}
