import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import Swal from 'sweetalert2';
import '../styles/login.css';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    
    const result = await authService.cadastrar(nome, email, senha);
    
    if (result.success) {
      await Swal.fire({
        color: "white",
        background: "#1f2021",
        title: "Sucesso!",
        text: "Cadastro realizado com sucesso!",
        icon: "success"
      });
      navigate('/login');
    } else {
      Swal.fire({
        color: "white",
        background: "#1f2021",
        title: "Erro!",
        text: result.message || "Erro ao realizar cadastro!",
        icon: "error"
      });
    }
  };

  return (
    <div className="banner">
      <div className="navbar">
        <p></p>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/login-admin">Administradores</Link></li>
        </ul>
      </div>
      <div className="content">
        <h1>Cadastro</h1>
        <form onSubmit={handleCadastro}>
          <div className="form-group">
            <label htmlFor="txtnome">Nome:</label>
            <input
              type="text"
              id="txtnome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="txtemail">Email:</label>
            <input
              type="email"
              id="txtemail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="txtsenha">Senha:</label>
            <input
              type="password"
              id="txtsenha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button type="submit">
            <span></span>Cadastrar
          </button>
        </form>
        <p>
          Já tem uma conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;
