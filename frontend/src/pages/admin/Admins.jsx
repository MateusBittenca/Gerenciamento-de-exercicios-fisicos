import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { swalDark } from '../../api/client';

export default function Admins() {
  const { request } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '' });
  const [criarAberto, setCriarAberto] = useState(false);
  const [novo, setNovo] = useState({ nome: '', email: '', senha: '' });

  async function carregar() {
    const obj = await request('/admin', { method: 'get' });
    if (obj.status === true) {
      setAdmins(obj.dados || []);
    } else {
      alert('login invalido');
    }
  }

  useEffect(() => {
    carregar();
  }, [request]);

  async function criar() {
    const obj = await request('/admin/cadastrar', {
      method: 'post',
      body: JSON.stringify(novo)
    });
    setCriarAberto(false);
    setNovo({ nome: '', email: '', senha: '' });
    if (obj.status === true) {
      Swal.fire({
        ...swalDark,
        title: 'Sucesso!',
        text: 'Usuario criado com sucesso!',
        icon: 'success'
      });
      carregar();
    } else {
      alert('login invalido!');
    }
  }

  async function excluir(id) {
    const result = await Swal.fire({
      title: 'Você tem certeza?',
      text: 'Você não poderá reverter a sua escolha!',
      icon: 'warning',
      showCancelButton: true,
      ...swalDark,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar!',
      confirmButtonText: 'Sim!'
    });
    if (!result.isConfirmed) {
      return;
    }
    const obj = await request('/admin/' + id, { method: 'delete' });
    if (obj.status === true) {
      Swal.fire({
        title: 'Excluido!',
        ...swalDark,
        text: 'Usuario excluido!.',
        icon: 'success'
      });
      carregar();
    } else {
      alert('Login invalido');
    }
  }

  function iniciarEdicao(admin) {
    setEditandoId(admin.AdministradorID);
    setForm({ nome: admin.Nome, email: admin.Email });
  }

  async function salvar(adminId) {
    const obj = await request('/admin/' + adminId, {
      method: 'put',
      body: JSON.stringify({ nome: form.nome, email: form.email })
    });
    if (obj.status === true) {
      setEditandoId(null);
      Swal.fire({
        ...swalDark,
        title: 'Sucesso!',
        text: 'Usuario modificado com sucesso!',
        icon: 'success'
      });
      carregar();
    } else {
      alert('Login invalido!');
    }
  }

  const visiveis = admins.filter((admin) => {
    if (!filtro) {
      return true;
    }
    return (admin.Nome || '').toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <div>
      <div className="uf-page-head">
        <div>
          <h1>Administradores</h1>
          <p>Quem pode gerenciar o catálogo, as listas e os alunos.</p>
        </div>
        <button type="button" className="uf-btn-primary" id="Create-admin" onClick={() => setCriarAberto(true)}>
          <span className="material-symbols-outlined">add</span>
          Novo admin
        </button>
      </div>
      <div className="uf-toolbar">
        <div className="uf-search">
          <span className="material-symbols-outlined">search</span>
          <input type="text" id="txtFiltro" className="uf-input" placeholder="Filtro" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
        </div>
      </div>
      <div className="uf-card uf-table-wrap">
        <table className="uf-table" id="tblAdmin">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Excluir</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {visiveis.length === 0 ? (
              <tr>
                <td colSpan="5" className="uf-empty">Nenhum administrador encontrado.</td>
              </tr>
            ) : visiveis.map((admin) => (
              <tr key={admin.AdministradorID}>
                {editandoId === admin.AdministradorID ? (
                  <>
                    <td>{admin.AdministradorID}</td>
                    <td><input type="text" className="uf-input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></td>
                    <td><input type="email" className="uf-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></td>
                    <td colSpan="2">
                      <button type="button" className="uf-btn-primary" onClick={() => salvar(admin.AdministradorID)}>Salvar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{admin.AdministradorID}</td>
                    <td>{admin.Nome}</td>
                    <td>{admin.Email}</td>
                    <td>
                      <button type="button" className="uf-btn-danger btn-excluir" onClick={() => excluir(admin.AdministradorID)}>Excluir</button>
                    </td>
                    <td>
                      <button type="button" className="uf-btn-edit btn-editar" onClick={() => iniciarEdicao(admin)}>Editar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {criarAberto && (
        <div className="uf-modal" onClick={() => setCriarAberto(false)}>
          <div className="uf-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="uf-modal-close" onClick={() => setCriarAberto(false)}>&times;</button>
            <div className="uf-modal-form">
              <h2>Novo administrador</h2>
              <input type="text" className="uf-input" placeholder="Nome" value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} />
              <input type="email" className="uf-input" placeholder="Email" value={novo.email} onChange={(e) => setNovo({ ...novo, email: e.target.value })} />
              <input type="password" className="uf-input" placeholder="Senha" value={novo.senha} onChange={(e) => setNovo({ ...novo, senha: e.target.value })} />
              <button type="button" className="uf-btn-primary" onClick={criar}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
