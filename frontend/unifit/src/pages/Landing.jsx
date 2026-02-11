import { Link } from 'react-router-dom';
import '../App.css';
import logo from '../assets/images/logo.png';

const Landing = () => {
  return (
    <div className="landing">
      <header className="landing__header">
        <div className="landing__header-inner">
          <Link to="/" className="landing__brand">
            <img src={logo} alt="Unifit" />
            <span>Unifit</span>
          </Link>
          <nav className="landing__nav">
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro" className="landing__cta-nav">Cadastrar</Link>
            <Link to="/login-admin" className="landing__admin">Admin</Link>
          </nav>
        </div>
      </header>

      <section className="landing__hero">
        <div className="landing__hero-background">
          <div className="landing__hero-blob landing__hero-blob--1"></div>
          <div className="landing__hero-blob landing__hero-blob--2"></div>
          <div className="landing__hero-grid"></div>
        </div>
        <div className="landing__hero-container">
          <div className="landing__hero-inner">
            <span className="landing__badge">
              <i className="bi bi-stars"></i>
              Grátis · Sem cartão
            </span>
            <h1 className="landing__title">
              Seus treinos.<br />
              <span className="landing__title-accent">Organizados.</span>
            </h1>
            <p className="landing__lead">
              Crie listas de exercícios, monte seus treinos e acompanhe seu progresso. 
              Tudo em um só lugar, de forma simples e rápida.
            </p>
            <div className="landing__actions">
              <Link to="/cadastro" className="landing__btn landing__btn--primary">
                <span>Começar agora</span>
                <i className="bi bi-arrow-right"></i>
              </Link>
              <Link to="/login" className="landing__btn landing__btn--secondary">
                Já tenho conta
              </Link>
            </div>
            <p className="landing__hero-hint">
              <i className="bi bi-shield-check"></i>
              Leva menos de 1 minuto para criar sua conta.
            </p>
          </div>
          <div className="landing__hero-visual">
            <div className="landing__hero-visual-card">
              <img src={logo} alt="" />
            </div>
          </div>
        </div>
      </section>

      <section className="landing__stats">
        <div className="landing__stats-container">
          <div className="landing__stat">
            <div className="landing__stat-number">100+</div>
            <div className="landing__stat-label">Exercícios</div>
          </div>
          <div className="landing__stat-divider"></div>
          <div className="landing__stat">
            <div className="landing__stat-number">100%</div>
            <div className="landing__stat-label">Gratuito</div>
          </div>
          <div className="landing__stat-divider"></div>
          <div className="landing__stat">
            <div className="landing__stat-number">∞</div>
            <div className="landing__stat-label">Treinos</div>
          </div>
        </div>
      </section>

      <section className="landing__info">
        <div className="landing__info-header">
          <span className="landing__info-subtitle">Recursos</span>
          <h2 className="landing__info-title">Tudo que você precisa para treinar melhor</h2>
          <p className="landing__info-description">
            Ferramentas profissionais para organizar sua rotina de treinos
          </p>
        </div>
        <div className="landing__info-grid">
          <article className="landing__info-card">
            <div className="landing__info-card-header">
              <span className="landing__info-icon" aria-hidden>
                <i className="bi bi-journal-check" />
              </span>
            </div>
            <h3>Listas de exercícios</h3>
            <p>Monte treinos do zero ou use o catálogo de exercícios com filtros por músculo, equipamento e dificuldade.</p>
            <div className="landing__info-card-footer">
              <span className="landing__info-badge">Personalizado</span>
            </div>
          </article>
          <article className="landing__info-card">
            <div className="landing__info-card-header">
              <span className="landing__info-icon" aria-hidden>
                <i className="bi bi-list-ul" />
              </span>
            </div>
            <h3>Minhas listas</h3>
            <p>Guarde seus treinos favoritos, edite quando quiser e use no dia a dia na academia ou em casa.</p>
            <div className="landing__info-card-footer">
              <span className="landing__info-badge">Flexível</span>
            </div>
          </article>
          <article className="landing__info-card">
            <div className="landing__info-card-header">
              <span className="landing__info-icon" aria-hidden>
                <i className="bi bi-graph-up-arrow" />
              </span>
            </div>
            <h3>Foco no progresso</h3>
            <p>Organize sua rotina e mantenha a consistência. Menos dúvida, mais resultado.</p>
            <div className="landing__info-card-footer">
              <span className="landing__info-badge">Eficiente</span>
            </div>
          </article>
        </div>
      </section>

      <section className="landing__features">
        <div className="landing__features-container">
          <div className="landing__features-content">
            <span className="landing__features-label">Por que escolher?</span>
            <h2 className="landing__features-title">Simplifique seus treinos</h2>
            <ul className="landing__features-list">
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <div>
                  <strong>Interface intuitiva</strong>
                  <span>Design limpo e fácil de usar</span>
                </div>
              </li>
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <div>
                  <strong>Catálogo completo</strong>
                  <span>Centenas de exercícios categorizados</span>
                </div>
              </li>
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <div>
                  <strong>Acesse de qualquer lugar</strong>
                  <span>Seus treinos sempre disponíveis</span>
                </div>
              </li>
              <li>
                <i className="bi bi-check-circle-fill"></i>
                <div>
                  <strong>Totalmente gratuito</strong>
                  <span>Sem taxas ocultas ou limitações</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="landing__features-visual">
            <div className="landing__features-card landing__features-card--1">
              <i className="bi bi-trophy-fill"></i>
              <span>Seus objetivos</span>
            </div>
            <div className="landing__features-card landing__features-card--2">
              <i className="bi bi-lightning-charge-fill"></i>
              <span>Performance</span>
            </div>
            <div className="landing__features-card landing__features-card--3">
              <i className="bi bi-heart-pulse-fill"></i>
              <span>Saúde</span>
            </div>
          </div>
        </div>
      </section>

      <section className="landing__cta-block">
        <div className="landing__cta-inner">
          <div className="landing__cta-icon">
            <i className="bi bi-rocket-takeoff-fill"></i>
          </div>
          <h2 className="landing__cta-title">Pronto para organizar seus treinos?</h2>
          <p className="landing__cta-text">Crie sua conta grátis e comece a montar suas listas hoje. Sem compromisso.</p>
          <Link to="/cadastro" className="landing__btn landing__btn--primary landing__btn--large">
            <span>Criar conta grátis</span>
            <i className="bi bi-arrow-right"></i>
          </Link>
          <p className="landing__cta-note">
            Não é necessário cartão de crédito
          </p>
        </div>
      </section>

      <footer className="landing__footer">
        <div className="landing__footer-container">
          <div className="landing__footer-brand">
            <img src={logo} alt="Unifit" />
            <span>Unifit</span>
          </div>
          <p className="landing__footer-tagline">
            Gestão de treinos para quem leva o treino a sério.
          </p>
          <div className="landing__footer-links">
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro">Cadastrar</Link>
            <Link to="/login-admin">Admin</Link>
          </div>
          <div className="landing__footer-copyright">
            © 2026 Unifit. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
