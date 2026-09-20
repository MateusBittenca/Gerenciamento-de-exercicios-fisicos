import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import AdminLogin from './pages/public/AdminLogin';
import Home from './pages/user/Home';
import Exercises from './pages/user/Exercises';
import PublicLists from './pages/user/PublicLists';
import MyLists from './pages/user/MyLists';
import Profile from './pages/user/Profile';
import Users from './pages/admin/Users';
import Admins from './pages/admin/Admins';
import AdminExercises from './pages/admin/Exercises';
import AdminLists from './pages/admin/Lists';
import AddExerciseToList from './pages/admin/AddExerciseToList';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedRoute role="user" />}>
            <Route element={<UserLayout />}>
              <Route path="/app" element={<Home />} />
              <Route path="/app/exercicios" element={<Exercises />} />
              <Route path="/app/listas" element={<PublicLists />} />
              <Route path="/app/minhas-listas" element={<MyLists />} />
              <Route path="/app/perfil" element={<Profile />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute role="admin" />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/usuarios" element={<Users />} />
              <Route path="/admin/admins" element={<Admins />} />
              <Route path="/admin/exercicios" element={<AdminExercises />} />
              <Route path="/admin/listas" element={<AdminLists />} />
              <Route path="/admin/listas/adicionar" element={<AddExerciseToList />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
