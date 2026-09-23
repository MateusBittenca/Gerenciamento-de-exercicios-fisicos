import { Link, useNavigate } from 'react-router-dom';
import '../../css/landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="uf-landing">
      <header className="uf-lp-header">
        <div className="uf-lp-header-inner">
          <div className="uf-lp-header-left">
            <a href="#inicio" className="uf-brand">
              <img src="/image/logo.png" alt="UniFit" />
              UniFit
            </a>
            <nav className="uf-lp-nav">
              <a href="#sobre">Sobre</a>
              <a href="#funcionalidades">Funcionalidades</a>
              <a href="#unidades">Para Academias</a>
              <a href="#unidades">Unidades</a>
            </nav>
          </div>
          <div className="uf-lp-header-right">
            <Link to="/login" className="uf-lp-link-quiet">Já sou aluno / Entrar</Link>
            <Link to="/login?papel=admin" className="uf-lp-link-admin">Acesso Admin</Link>
            <button type="button" className="uf-lp-cta" onClick={() => navigate('/cadastro')}>Começar Agora</button>
            <Link to="/login" className="uf-lp-person" aria-label="Entrar">
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>person</span>
            </Link>
          </div>
        </div>
      </header>

      <main id="inicio">
        <div className="uf-lp-hero-wrap">
          <div className="uf-lp-glow a" />
          <div className="uf-lp-glow b" />

          <section className="uf-lp-section">
            <div className="uf-lp-hero">
              <h1>O gerenciador de treinos oficial da sua academia</h1>
              <p>Catálogo completo com animações de execução, listas prescritas por instrutores e controle pessoal de cargas e biomecânica.</p>
              <div className="uf-lp-hero-actions">
                <button type="button" className="uf-lp-cta lg" onClick={() => navigate('/cadastro')}>
                  Cadastrar como aluno
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
                <button type="button" className="uf-lp-cta ghost lg" onClick={() => navigate('/login')}>
                  Entrar na minha conta
                </button>
              </div>
              <p className="uf-hero-note">
                <Link to="/login?papel=admin">
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>corporate_fare</span>
                  Acesso de administrador da academia
                </Link>
              </p>
            </div>

            <div className="uf-lp-mock">
              <div className="uf-lp-mock-glow" />
              <div className="uf-lp-mock-card">
                <div className="uf-lp-mock-bar">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="uf-lp-traffic">
                      <span className="r" />
                      <span className="y" />
                      <span className="g" />
                    </div>
                    <small>Painel do Aluno • Unidade Jardins Central</small>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="uf-lp-live">
                      <span className="uf-lp-dot" style={{ width: 6, height: 6 }} />
                      Sessão em Andamento
                    </span>
                    <small style={{ color: '#1b1c1d' }}>Ficha A: Peitoral &amp; Tríceps</small>
                  </div>
                </div>

                <div className="uf-lp-mock-body">
                  <div className="uf-lp-gif-wrap">
                    <img src="/ExerciciosGif/Supino-reto-barra.gif" alt="Supino reto com barra" />
                    <div className="uf-lp-gif-cap">
                      <div>
                        <span>Biomecânica Validada</span>
                        <h3>Supino Reto com Barra Olímpica</h3>
                      </div>
                      <div className="uf-lp-gif-icon">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fitness_center</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="uf-lp-chips">
                      <span className="uf-lp-chip red">Peitoral Maior (Foco Primário)</span>
                      <span className="uf-lp-chip">Tríceps Braquial • Sinergista</span>
                      <span className="uf-lp-chip">Deltoide Anterior</span>
                    </div>
                    <div className="uf-lp-metrics" style={{ marginTop: 16 }}>
                      <div>
                        <span>Séries</span>
                        <strong>4</strong>
                        <em>8 - 10 Reps</em>
                      </div>
                      <div>
                        <span>Carga Sugerida</span>
                        <strong className="red">76 <em style={{ fontSize: 12, color: '#c30505' }}>kg</em></strong>
                        <em>+2.5kg vs última sem.</em>
                      </div>
                      <div>
                        <span>Descanso</span>
                        <strong>90s</strong>
                        <em>Intervalo estrito</em>
                      </div>
                    </div>
                    <div className="uf-lp-sets" style={{ marginTop: 12 }}>
                      <div className="uf-lp-set">
                        <div className="uf-lp-set-left">
                          <div className="uf-lp-set-n done"><span className="material-symbols-outlined" style={{ fontSize: 16 }}>check</span></div>
                          Série 1 • Aquecimento
                        </div>
                        <small>10 reps • 60 kg</small>
                      </div>
                      <div className="uf-lp-set active">
                        <div className="uf-lp-set-left">
                          <div className="uf-lp-set-n now">2</div>
                          Série 2 • Carga Principal
                        </div>
                        <small style={{ color: '#c30505', fontWeight: 700 }}>8 reps • 76 kg</small>
                      </div>
                      <div className="uf-lp-set dim">
                        <div className="uf-lp-set-left">
                          <div className="uf-lp-set-n">3</div>
                          Série 3 • Hipertrofia
                        </div>
                        <small>8 reps • 76 kg</small>
                      </div>
                    </div>
                    <button type="button" className="uf-lp-cta" style={{ width: '100%', marginTop: 12, height: 44 }} onClick={() => navigate('/cadastro')}>
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>timer</span>
                      Concluir Série &amp; Iniciar Descanso (90s)
                    </button>
                  </div>
                </div>

                <div className="uf-lp-mock-foot">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="material-symbols-outlined" style={{ color: '#005cba', fontSize: 18 }}>sync_alt</span>
                    Sincronizado em tempo real com instrutor: Prof. André Silva (CREF 08921-G/SP)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: 'var(--uf-font-title)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 11 }}>
                    Volume Total: 2.140 kg
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e9e8e9' }} />
                    RPE Médio: 8.5
                  </div>
                </div>
              </div>
            </div>

            <div className="uf-lp-stats">
              <div className="uf-lp-stat">
                <div className="uf-lp-stat-icon"><span className="material-symbols-outlined">group</span></div>
                <div>
                  <strong>+150.000</strong>
                  <span>Alunos ativos no app</span>
                </div>
              </div>
              <div className="uf-lp-vr" />
              <div className="uf-lp-stat">
                <div className="uf-lp-stat-icon blue"><span className="material-symbols-outlined">apartment</span></div>
                <div>
                  <strong>450+</strong>
                  <span>Academias credenciadas</span>
                </div>
              </div>
              <div className="uf-lp-vr" />
              <div className="uf-lp-stat">
                <div className="uf-lp-stat-icon"><span className="material-symbols-outlined">verified</span></div>
                <div>
                  <strong>99.4%</strong>
                  <span>Assertividade biomecânica</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="uf-lp-section" id="funcionalidades">
          <div className="uf-lp-center">
            <div className="uf-lp-kicker">
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>tune</span>
              Tecnologia &amp; Engenharia de Performance
            </div>
            <h2>Engenharia pensada para o aluno moderno e o treinador exigente</h2>
            <p>Uma ponte digital sem atritos entre a sala de musculação, a supervisão técnica e seus resultados diários.</p>
          </div>
          <div className="uf-lp-cols">
            <article className="uf-lp-feature">
              <div>
                <div className="uf-lp-ico"><span className="material-symbols-outlined" style={{ fontSize: 28 }}>vital_signs</span></div>
                <span className="uf-lp-chip">+350 Variações</span>
                <h3>Catálogo Técnico de Exercícios</h3>
                <p>Mais de 350 variações biomecânicas com demonstração visual, ativação muscular primária e sinergistas em alta definição.</p>
                <div className="uf-lp-checks">
                  <div><span className="material-symbols-outlined">check_circle</span> Visualização 3D de vetores de força</div>
                  <div><span className="material-symbols-outlined">check_circle</span> Filtro por aparelhos e pesos livres</div>
                  <div><span className="material-symbols-outlined">check_circle</span> Dicas posturais para prevenção de lesões</div>
                </div>
              </div>
              <div className="uf-lp-thumb">
                <img src={'/ExerciciosGif/' + encodeURIComponent('Flexão.gif')} alt="Catálogo de exercícios" />
                <span>Biblioteca Técnica Atualizada 2026</span>
              </div>
            </article>
            <article className="uf-lp-feature">
              <div>
                <div className="uf-lp-ico blue"><span className="material-symbols-outlined" style={{ fontSize: 28 }}>assignment_turned_in</span></div>
                <span className="uf-lp-chip" style={{ background: 'rgba(0,92,186,0.1)', color: '#005cba' }}>Homologado por Instrutores</span>
                <h3>Listas Oficiais e Periodização</h3>
                <p>Treinos montados e homologados pelos instrutores da sua unidade. Divisões inteligentes ABC, hipertrofia, força e recomposição corporal.</p>
                <div className="uf-lp-checks">
                  <div><span className="material-symbols-outlined blue">check_circle</span> Sincronização imediata no celular</div>
                  <div><span className="material-symbols-outlined blue">check_circle</span> Períodos de deload e progressão contínua</div>
                  <div><span className="material-symbols-outlined blue">check_circle</span> Ajustes rápidos em tempo real</div>
                </div>
              </div>
              <div className="uf-lp-thumb">
                <img src="/image/academiaTCC.jpg" alt="Listas oficiais" />
                <span>Prescrição Conectada &amp; Inteligente</span>
              </div>
            </article>
            <article className="uf-lp-feature">
              <div>
                <div className="uf-lp-ico"><span className="material-symbols-outlined" style={{ fontSize: 28 }}>monitoring</span></div>
                <span className="uf-lp-chip">Controle Pessoal</span>
                <h3>Autonomia com Métricas Reais</h3>
                <p>Monte suas próprias rotinas personalizadas, acompanhe o histórico analítico de sobrecargas e a evolução biométrica com peso e IMC.</p>
                <div className="uf-lp-checks">
                  <div><span className="material-symbols-outlined">check_circle</span> Gráficos de 1RM e tonelagem semanal</div>
                  <div><span className="material-symbols-outlined">check_circle</span> Feedbacks de RPE e esforço percebido</div>
                  <div><span className="material-symbols-outlined">check_circle</span> Exportação de relatórios para o seu personal</div>
                </div>
              </div>
              <div className="uf-lp-chart" style={{ marginTop: 24 }}>
                <div className="uf-lp-chart-top">
                  <span>Evolução Carga (kg)</span>
                  <b>+18.4% no mês</b>
                </div>
                <svg viewBox="0 0 200 60" preserveAspectRatio="none" style={{ width: '100%', height: 64, color: '#c30505' }}>
                  <path d="M0 50 Q 30 45, 60 38 T 120 25 T 160 18 T 200 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  <path d="M0 50 Q 30 45, 60 38 T 120 25 T 160 18 T 200 8 L 200 60 L 0 60 Z" fill="currentColor" fillOpacity="0.08" />
                  <circle cx="200" cy="8" r="4" fill="currentColor" />
                </svg>
                <div className="uf-lp-chart-axis">
                  <span>Semana 1</span>
                  <span>Semana 2</span>
                  <span>Semana 3</span>
                  <span>Hoje</span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section className="uf-lp-section" id="sobre">
          <div className="uf-lp-how">
            <div className="uf-lp-center">
              <span className="uf-lp-kicker">Fluxo Simples • Zero Burocracia</span>
              <h2>Como Funciona na Prática</h2>
              <p>Três passos diretos para conectar sua matrícula física à melhor experiência de treino.</p>
            </div>
            <div className="uf-lp-cols">
              <div>
                <div className="uf-lp-step-n one">1</div>
                <span className="uf-lp-kicker">Início Imediato</span>
                <h3>Cadastre-se na sua unidade</h3>
                <p>Selecione sua academia credenciada UniFit pelo nome ou código da recepção. Seu perfil é vinculado instantaneamente com seu plano.</p>
              </div>
              <div>
                <div className="uf-lp-step-n">2</div>
                <span className="uf-lp-kicker" style={{ color: '#005cba' }}>Prescrição Técnica</span>
                <h3>Acesse as fichas dos seus instrutores</h3>
                <p>Visualize as rotinas prescritas para seu objetivo, com intervalos de recuperação, vídeos de biomecânica e ordem ideal de exercícios.</p>
              </div>
              <div>
                <div className="uf-lp-step-n">3</div>
                <span className="uf-lp-kicker">Evolução Real</span>
                <h3>Acompanhe a execução e supere suas marcas</h3>
                <p>Registre cada série concluída, anote suas cargas e visualize seu progresso semanal em gráficos objetivos de tonelagem e força.</p>
              </div>
            </div>
            <div className="uf-lp-strip">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="uf-lp-stat-icon" style={{ width: 32, height: 32 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>bolt</span>
                </div>
                <p><strong>Sem planilhas de papel.</strong> 100% digital, compatível com iOS, Android e terminais touch no salão da academia.</p>
              </div>
              <button type="button" className="uf-lp-kicker" style={{ border: 0, background: 'none', cursor: 'pointer' }} onClick={() => navigate('/cadastro')}>
                Ver demonstração guiada
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>chevron_right</span>
              </button>
            </div>
          </div>
        </section>

        <section className="uf-lp-section" id="unidades">
          <div className="uf-lp-final">
            <div className="uf-lp-final-row">
              <div>
                <h2>Pronto para transformar sua rotina de treinos?</h2>
                <p>Seja você um aluno buscando quebrar seus recordes ou um gestor que deseja modernizar a sala de musculação da sua academia, comece agora mesmo.</p>
                <div className="uf-lp-final-checks">
                  <div><span className="material-symbols-outlined" style={{ color: '#c30505', fontSize: 18 }}>done_all</span> Sem fidelidade obrigatória</div>
                  <div><span className="material-symbols-outlined" style={{ color: '#c30505', fontSize: 18 }}>done_all</span> Configuração em menos de 2 minutos</div>
                  <div><span className="material-symbols-outlined" style={{ color: '#c30505', fontSize: 18 }}>done_all</span> Suporte técnico especializado</div>
                </div>
              </div>
              <div className="uf-lp-final-actions">
                <button type="button" className="uf-lp-cta lg" onClick={() => navigate('/cadastro')}>
                  <span className="material-symbols-outlined">person_add</span>
                  Criar Conta de Aluno
                </button>
                <button type="button" className="uf-lp-cta soft lg" onClick={() => navigate('/login?papel=admin')}>
                  <span className="material-symbols-outlined">support_agent</span>
                  Entrar como administrador
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="uf-lp-footer">
        <div className="uf-lp-footer-inner">
          <div className="uf-lp-footer-top">
            <div className="uf-brand">
              <img src="/image/logo.png" alt="UniFit" />
              UniFit
              <span className="uf-lp-badge">Tecnologia Fitness</span>
            </div>
            <div className="uf-lp-footer-links">
              <a href="#sobre">Sobre a Plataforma</a>
              <a href="#funcionalidades">Termos de Uso</a>
              <a href="#funcionalidades">Política de Privacidade</a>
              <a href="#unidades">Central de Ajuda</a>
            </div>
          </div>
          <div className="uf-lp-footer-bot">
            <p>© 2026 UniFit Tecnologia Fitness Ltda. Todos os direitos reservados.</p>
            <p>Engenharia de Performance e Gestão de Treinos</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
