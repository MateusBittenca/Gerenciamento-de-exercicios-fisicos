import Sidebar from '../components/Sidebar';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/configuracoes.css';

const Configuracoes = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="configuracoes-page">
      <Sidebar />
      <div className="itens">
        <header className="config-page-header">
          <h1>Configurações</h1>
          <p>Preferências gerais e aparência do site</p>
        </header>

        <div className="config-blocks">
          <section className="config-card">
            <h2>Aparência</h2>
            <div className="config-item config-item-toggle">
              <div className="config-label-desc">
                <span className="config-label">Modo do site</span>
                <span className="config-desc">Escolha entre tema escuro ou claro</span>
              </div>
              <div className="config-theme-switch">
                <button
                  type="button"
                  className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => setTheme('dark')}
                  aria-pressed={theme === 'dark'}
                >
                  <i className="bi bi-moon-stars" aria-hidden></i>
                  Escuro
                </button>
                <button
                  type="button"
                  className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => setTheme('light')}
                  aria-pressed={theme === 'light'}
                >
                  <i className="bi bi-sun" aria-hidden></i>
                  Claro
                </button>
              </div>
            </div>
          </section>

          <section className="config-card">
            <h2>Geral</h2>
            <div className="config-item">
              <div className="config-label-desc">
                <span className="config-label">Notificações</span>
                <span className="config-desc">Exibir lembretes e dicas no app</span>
              </div>
              <div className="config-placeholder">
                <span className="config-badge">Em breve</span>
              </div>
            </div>
            <div className="config-item">
              <div className="config-label-desc">
                <span className="config-label">Idioma</span>
                <span className="config-desc">Idioma da interface</span>
              </div>
              <div className="config-placeholder">
                <span className="config-badge">Em breve</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;
