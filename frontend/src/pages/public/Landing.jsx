import { Link, useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="uf-landing">
      <header className="uf-landing-header">
        <div className="uf-brand">
          <img src="/image/logo.png" alt="UniFit" />
          UniFit
        </div>
        <Link to="/admin/login" className="uf-admin-link" style={{ marginTop: 0 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>admin_panel_settings</span>
          Administrador
        </Link>
      </header>
      <section className="uf-landing-hero">
        <p className="uf-kicker">Treino com clareza</p>
        <h1>Seu treino organizado, do catálogo à lista.</h1>
        <p>Acesse o catálogo de exercícios, monte suas listas e acompanhe o que a academia recomenda — tudo em um portal claro e direto.</p>
        <div className="uf-landing-actions">
          <button type="button" className="uf-btn-primary" onClick={() => navigate('/cadastro')}>Cadastrar</button>
          <button type="button" className="uf-btn-outline" onClick={() => navigate('/login')}>Entrar</button>
        </div>
      </section>
    </div>
  );
}
