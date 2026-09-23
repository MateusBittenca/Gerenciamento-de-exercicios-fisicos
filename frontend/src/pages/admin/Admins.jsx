import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { swalDark } from '../../api/client';
import '../../css/table.css';
import '../../css/homepageAdm.css';

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
      Swal.fire({
        ...swalDark,
        title: 'Sessão expirada!',
        text: 'Não foi possível carregar os administradores. Faça login novamente.',
        icon: 'error'
      });
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
      Swal.fire({
        ...swalDark,
        title: 'Erro!',
        text: 'Não foi possível criar o administrador. Verifique os dados e tente novamente.',
        icon: 'error'
      });
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
      Swal.fire({
        ...swalDark,
        title: 'Erro!',
        text: 'Não foi possível excluir o administrador.',
        icon: 'error'
      });
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
      Swal.fire({
        ...swalDark,
        title: 'Erro!',
        text: 'Não foi possível salvar as alterações do administrador.',
        icon: 'error'
      });
    }
  }

  const visiveis = admins.filter((admin) => {
    if (!filtro) {
      return true;
    }
    return (admin.Nome || '').toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <div className="tabela">
      <div className="cabeca">
        <h1>Administradores</h1>
        <br />
        <img
          src="/image/alem-disso-positivo-adicionar-simbolo-matematico.png"
          alt=""
          id="Create-admin"
          onClick={() => setCriarAberto(true)}
        />
      </div>
      <br />
      <input type="text" id="txtFiltro" placeholder="Filtro" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
      <br /><br />
      <div className="tabela-scroll">
      <table id="tblAdmin">
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
          {visiveis.map((admin) => (
            <tr key={admin.AdministradorID}>
              {editandoId === admin.AdministradorID ? (
                <>
                  <td>{admin.AdministradorID}</td>
                  <td><input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></td>
                  <td><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></td>
                  <td colSpan="2">
                    <button onClick={() => salvar(admin.AdministradorID)}>Salvar</button>
                  </td>
                </>
              ) : (
                <>
                  <td>{admin.AdministradorID}</td>
                  <td>{admin.Nome}</td>
                  <td>{admin.Email}</td>
                  <td>
                    <button className="btn-excluir" onClick={() => excluir(admin.AdministradorID)}>Excluir</button>
                  </td>
                  <td>
                    <button className="btn-editar" onClick={() => iniciarEdicao(admin)}>Editar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {criarAberto && (
        <div className="modal aberto">
          <div className="modal-content">
            <span className="close-button" onClick={() => setCriarAberto(false)}>&times;</span>
            <input type="text" placeholder="Nome" value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} />
            <input type="email" placeholder="Email" value={novo.email} onChange={(e) => setNovo({ ...novo, email: e.target.value })} />
            <input type="password" placeholder="Senha" value={novo.senha} onChange={(e) => setNovo({ ...novo, senha: e.target.value })} />
            <button onClick={criar}>Confirmar</button>
          </div>
        </div>
      )}
    </div>
  );
}
