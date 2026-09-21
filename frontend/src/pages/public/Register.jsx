import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';

export default function Register() {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [sexo, setSexo] = useState('');
  const [altura, setAltura] = useState('');
  const [peso, setPeso] = useState('');

  async function onclick_btnCadastrar(e) {
    e.preventDefault();
    const obj = await api('/usuario/cadastrar', {
      method: 'post',
      body: JSON.stringify({ nome, email, senha, sexo, altura, peso })
    });

    if (obj.status === true) {
      alert('cadastro feito com sucesso');
      navigate('/login');
    } else {
      alert('Nâo foi possivel cadastrar esse usuario!');
    }
  }

  return (
    <div className="uf-auth">
      <div className="uf-card uf-auth-card">
        <img src="/image/logo.png" alt="UniFit" />
        <span className="uf-chip uf-chip-ativo" style={{ margin: '16px auto 8px', cursor: 'default' }}>Portal do Aluno</span>
        <h1>Cadastro</h1>
        <p className="uf-muted">Crie sua conta para utilizar o catálogo e as listas.</p>
        <form onSubmit={onclick_btnCadastrar}>
          <div className="uf-field">
            <label>Nome</label>
            <input type="text" className="uf-input" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
          </div>
          <div className="uf-field">
            <label>Email</label>
            <input type="email" className="uf-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="uf-field">
            <label>Senha</label>
            <input type="password" className="uf-input" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
          </div>
          <div className="uf-field">
            <label>Sexo</label>
            <input type="text" className="uf-input" placeholder="Sexo" value={sexo} onChange={(e) => setSexo(e.target.value)} required />
          </div>
          <div className="uf-field">
            <label>Altura</label>
            <input type="text" className="uf-input" placeholder="Altura" value={altura} onChange={(e) => setAltura(e.target.value)} required />
          </div>
          <div className="uf-field">
            <label>Peso</label>
            <input type="text" className="uf-input" placeholder="Peso" value={peso} onChange={(e) => setPeso(e.target.value)} required />
          </div>
          <button id="btncadastrar" className="uf-btn-primary" type="submit">Cadastrar</button>
        </form>
        <p className="uf-muted" style={{ marginTop: 16 }}>
          Já possui uma conta? <Link to="/login" style={{ color: '#C30505', fontWeight: 600 }}>Clique aqui!</Link>
        </p>
      </div>
    </div>
  );
}
