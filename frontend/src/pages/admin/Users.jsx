import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useFeedback } from '../../auth/FeedbackContext';

export default function Users() {
  const { request } = useAuth();
  const { toast, confirmar } = useFeedback();
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({ nome: '', email: '', sexo: '', altura: '', peso: '' });

  async function carregar() {
    const obj = await request('/usuarios', { method: 'get' });
    if (obj.status === true) {
      setUsuarios(obj.dados || []);
    } else {
      toast('erro', obj.msg || 'Não foi possível carregar os alunos.');
    }
  }

  useEffect(() => {
    carregar();
  }, [request]);

  async function excluir(id) {
    const ok = await confirmar({
      titulo: 'Excluir este aluno?',
      texto: 'Essa ação não pode ser desfeita.',
      confirma: 'Excluir',
      perigo: true
    });
    if (!ok) {
      return;
    }
    const obj = await request('/usuario/' + id, { method: 'delete' });
    if (obj.status === true) {
      toast('ok', 'Aluno excluído.');
      carregar();
    } else {
      toast('erro', obj.msg || 'Não foi possível excluir.');
    }
  }

  function iniciarEdicao(usuario) {
    setEditandoId(usuario.UsuarioID);
    setForm({
      nome: usuario.Nome,
      email: usuario.Email,
      sexo: usuario.Sexo || '',
      altura: usuario.Altura || '',
      peso: usuario.Peso || ''
    });
  }

  async function salvar(usuarioId) {
    const obj = await request('/usuario/' + usuarioId, {
      method: 'put',
      body: JSON.stringify({
        nome: form.nome,
        email: form.email,
        sexo: form.sexo,
        altura: form.altura,
        peso: form.peso
      })
    });
    if (obj.status === true) {
      setEditandoId(null);
      toast('ok', 'Dados atualizados.');
      carregar();
    } else {
      toast('erro', obj.msg || 'Não foi possível salvar.');
    }
  }

  const visiveis = usuarios.filter((usuario) => {
    if (!filtro) {
      return true;
    }
    return (usuario.Nome || '').toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <div>
      <section className="uf-card uf-page-intro">
        <div>
          <p className="uf-kicker" style={{ marginBottom: 8 }}>Gestão operacional</p>
          <h1>Gestão de Usuários & Alunos</h1>
          <p>Cadastre, edite e monitore os alunos da academia.</p>
        </div>
      </section>
      <div className="uf-admin-kpis">
        <article className="uf-card uf-kpi">
          <div className="uf-kpi-top">
            Total de usuários
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>groups</span>
          </div>
          <strong>{usuarios.length}</strong>
        </article>
        <article className="uf-card uf-kpi">
          <div className="uf-kpi-top">
            Exibindo
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>filter_alt</span>
          </div>
          <strong>{visiveis.length}</strong>
        </article>
      </div>
      <div className="uf-toolbar">
        <div className="uf-search">
          <span className="material-symbols-outlined">search</span>
          <input type="text" id="txtFiltro" className="uf-input" placeholder="Buscar por nome ou e-mail..." value={filtro} onChange={(e) => setFiltro(e.target.value)} />
        </div>
      </div>
      <div className="uf-card uf-table-wrap">
        <table className="uf-table" id="tblUsuarios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Sexo</th>
              <th>Altura</th>
              <th>Peso</th>
              <th>Excluir</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {visiveis.length === 0 ? (
              <tr>
                <td colSpan="8" className="uf-empty">Nenhum usuário encontrado.</td>
              </tr>
            ) : visiveis.map((usuario) => (
              <tr key={usuario.UsuarioID}>
                {editandoId === usuario.UsuarioID ? (
                  <>
                    <td>{usuario.UsuarioID}</td>
                    <td><input type="text" className="uf-input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></td>
                    <td><input type="email" className="uf-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></td>
                    <td>
                      <select className="uf-select" value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })}>
                        <option value="" disabled>Sexo</option>
                        <option value="Feminino">Feminino</option>
                        <option value="Masculino">Masculino</option>
                      </select>
                    </td>
                    <td><input type="text" className="uf-input" value={form.altura} onChange={(e) => setForm({ ...form, altura: e.target.value })} /></td>
                    <td><input type="text" className="uf-input" value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} /></td>
                    <td colSpan="2">
                      <div className="uf-actions">
                        <button type="button" className="uf-btn-ghost" onClick={() => setEditandoId(null)}>Cancelar</button>
                        <button type="button" className="uf-btn-primary" onClick={() => salvar(usuario.UsuarioID)}>Salvar</button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{usuario.UsuarioID}</td>
                    <td>{usuario.Nome}</td>
                    <td>{usuario.Email}</td>
                    <td>{usuario.Sexo || ''}</td>
                    <td>{usuario.Altura || ''}</td>
                    <td>{usuario.Peso || ''}</td>
                    <td>
                      <button type="button" className="uf-btn-danger btn-excluir" onClick={() => excluir(usuario.UsuarioID)}>Excluir</button>
                    </td>
                    <td>
                      <button type="button" className="uf-btn-edit btn-editar" onClick={() => iniciarEdicao(usuario)}>Editar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
