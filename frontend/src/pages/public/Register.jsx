import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { api, swalDark } from '../../api/client';
import '../../css/login.css';

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
      await Swal.fire({
        ...swalDark,
        title: 'Cadastro realizado!',
        text: 'Sua conta foi criada com sucesso. Faça login para continuar.',
        icon: 'success'
      });
      navigate('/login');
    } else {
      Swal.fire({
        ...swalDark,
        title: 'Erro no cadastro!',
        text: 'Não foi possível cadastrar esse usuário. Verifique os dados e tente novamente.',
        icon: 'error'
      });
    }
  }

  return (
    <div className="banner pagina-cadastro">
      <div className="container">
        <div className="form-box">
          <form className="form" onSubmit={onclick_btnCadastrar}>
            <span className="title">Cadastro</span>
            <span className="subtitle">Cadastre para utilizar nossos recursos.</span>
            <div className="form-container">
              <input type="text" className="input" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
              <input type="email" className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" className="input" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required />
              <input type="text" className="input" placeholder="Sexo" value={sexo} onChange={(e) => setSexo(e.target.value)} required />
              <input type="text" className="input" placeholder="Altura" value={altura} onChange={(e) => setAltura(e.target.value)} required />
              <input type="text" className="input" placeholder="Peso" value={peso} onChange={(e) => setPeso(e.target.value)} required />
            </div>
            <button id="btncadastrar">Cadastrar</button>
          </form>
          <div className="form-section">
            <p>Já possui uma conta? <Link to="/login">Clique aqui!</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
