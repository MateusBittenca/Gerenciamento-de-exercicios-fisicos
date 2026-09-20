import { Link, useNavigate } from 'react-router-dom';
import '../../css/index.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="banner pagina-landing">
      <div className="navbar">
        <p></p>
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><Link to="/admin/login">Administradores</Link></li>
        </ul>
      </div>
      <div className="content">
        <img src="/image/logo.png" alt="logo" />
        <p><br /></p>
        <div>
          <button type="button" onClick={() => navigate('/login')}>
            <span></span> ENTRAR
          </button>
          <button type="button" onClick={() => navigate('/cadastro')}>
            <span></span> CADASTRAR
          </button>
        </div>
      </div>
    </div>
  );
}
