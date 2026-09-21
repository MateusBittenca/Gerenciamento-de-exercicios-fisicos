import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';

export default function Profile() {
  const { payload, request } = useAuth();
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    altura: '',
    sexo: '',
    peso: ''
  });

  async function fetch_usuario_get() {
    const obj = await request('/usuario/' + payload.usuarioId, { method: 'get' });
    if (obj.status === true) {
      const dados = Array.isArray(obj.dados) ? obj.dados[0] : obj.dados;
      setUsuario(dados);
      setForm({
        nome: dados.Nome || '',
        email: dados.Email || '',
        altura: dados.Altura || '',
        sexo: dados.Sexo || '',
        peso: dados.Peso || ''
      });
    } else {
      alert('login invalido');
    }
  }

  useEffect(() => {
    fetch_usuario_get();
  }, [payload.usuarioId]);

  function preencherOriginal() {
    if (!usuario) {
      return;
    }
    setForm({
      nome: usuario.Nome || '',
      email: usuario.Email || '',
      altura: usuario.Altura || '',
      sexo: usuario.Sexo || '',
      peso: usuario.Peso || ''
    });
  }

  async function salvar() {
    const novoUsuario = {
      nome: form.nome,
      email: form.email,
      altura: form.altura,
      sexo: form.sexo,
      peso: form.peso
    };
    const obj = await request('/usuario/' + payload.usuarioId, {
      method: 'put',
      body: JSON.stringify(novoUsuario)
    });
    if (obj.status === true) {
      setEditando(false);
      fetch_usuario_get();
    } else {
      alert('Login Inválido!');
    }
  }

  function descartar() {
    setEditando(false);
    preencherOriginal();
  }

  return (
    <div>
      <div className="uf-page-head">
        <div>
          <h1>Perfil</h1>
          <p>Seus dados cadastrais na academia.</p>
        </div>
      </div>
      <div className="uf-card uf-profile" style={{ padding: 28 }}>
        <h2 style={{ marginBottom: 16 }}>Dados do usuário</h2>
        <div className="uf-field">
          <label htmlFor="nome">Nome</label>
          <input type="text" id="nome" className="uf-input" placeholder="Nome" readOnly={!editando} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        </div>
        <div className="uf-field">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" className="uf-input" placeholder="Email" readOnly={!editando} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="uf-field">
          <label htmlFor="txtAltura">Altura</label>
          <input type="text" id="txtAltura" className="uf-input" placeholder="Altura" readOnly={!editando} value={form.altura} onChange={(e) => setForm({ ...form, altura: e.target.value })} />
        </div>
        <div className="uf-field">
          <label htmlFor="sexo">Sexo</label>
          <input type="text" id="sexo" className="uf-input" placeholder="Sexo" readOnly={!editando} value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })} />
        </div>
        <div className="uf-field">
          <label htmlFor="peso">Peso</label>
          <input type="number" id="peso" className="uf-input" placeholder="Peso" step="0.1" readOnly={!editando} value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} />
        </div>
        <div className="uf-actions" style={{ marginTop: 8 }}>
          {!editando ? (
            <button id="btnEditar" className="uf-btn-edit" onClick={() => setEditando(true)}>Editar</button>
          ) : (
            <>
              <button className="uf-btn-primary btnSalvar" onClick={salvar}>Salvar</button>
              <button className="uf-btn-ghost btnDescartar" onClick={descartar}>Descartar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
