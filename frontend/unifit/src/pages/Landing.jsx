import { Link } from 'react-router-dom';
import '../App.css';
import logo from '../assets/images/logo.png';

const Landing = () => {
  return (
    <div className="landing-page">
      <div className="banner">
        <div className="navbar">
          <p></p>
          <ul>
            <li><Link to="/">Início</Link></li>
            <li><Link to="/login-admin">Administradores</Link></li>
          </ul>
        </div>
        <div className="content">
          <img src={logo} alt="Unifit Logo" />
          <p>Gerencie seus treinos e alcance seus objetivos</p>
          <div>
            <Link to="/login">
              <button type="button">
                <span></span>ENTRAR
              </button>
            </Link>
            <Link to="/cadastro">
              <button type="button">
                <span></span>CADASTRAR
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
