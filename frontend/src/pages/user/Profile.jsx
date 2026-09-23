import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { swalDark } from '../../api/client';
import '../../css/usuario.css';

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
      Swal.fire({
        ...swalDark,
        title: 'Sessão expirada!',
        text: 'Não foi possível carregar seus dados. Faça login novamente.',
        icon: 'error'
      });
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
      Swal.fire({
        ...swalDark,
        title: 'Erro!',
        text: 'Não foi possível salvar as alterações do perfil.',
        icon: 'error'
      });
    }
  }

  function descartar() {
    setEditando(false);
    preencherOriginal();
  }

  return (
    <div className="pagina-perfil">
    <div className="model">
      <h2>Dados do Usuario</h2>
      <label htmlFor="nome">Nome:</label><br />
      <input type="text" id="nome" placeholder="Nome" readOnly={!editando} value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />

      <label htmlFor="email">Email:</label><br />
      <input type="email" id="email" placeholder="Email" readOnly={!editando} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />

      <label htmlFor="altura">Altura:</label><br />
      <input type="text" id="txtAltura" placeholder="Altura" readOnly={!editando} value={form.altura} onChange={(e) => setForm({ ...form, altura: e.target.value })} />

      <label htmlFor="sexo">Sexo:</label><br />
      <input type="text" id="sexo" placeholder="Sexo" readOnly={!editando} value={form.sexo} onChange={(e) => setForm({ ...form, sexo: e.target.value })} />

      <label htmlFor="peso">Peso:</label><br />
      <input type="number" id="peso" placeholder="Peso" step="0.1" readOnly={!editando} value={form.peso} onChange={(e) => setForm({ ...form, peso: e.target.value })} />
      <br /><br />

      {!editando ? (
        <button id="btnEditar" onClick={() => setEditando(true)}>Editar</button>
      ) : (
        <>
          <button className="btnSalvar" onClick={salvar}>Salvar</button>
          <button className="btnDescartar" onClick={descartar}>Descartar</button>
        </>
      )}
    </div>
    </div>
  );
}
