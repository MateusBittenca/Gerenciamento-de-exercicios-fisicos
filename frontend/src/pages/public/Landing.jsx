import { Link, useNavigate } from 'react-router-dom';
import '../../css/landing.css';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="uf-landing" id="inicio">
      <a className="uf-lp-skip" href="#conteudo">Ir para o conteúdo</a>

      <header className="uf-lp-header">
        <div className="uf-lp-header-inner">
          <a href="#inicio" className="uf-lp-brand">
            <img src="/image/logo.png" alt="UniFit" />
          </a>
          <nav className="uf-lp-nav" aria-label="Seções da página">
            <a href="#como-funciona">Como funciona</a>
            <a href="#recursos">Recursos</a>
            <a href="#academias">Para academias</a>
          </nav>
          <div className="uf-lp-header-actions">
            <Link to="/login" className="uf-lp-entrar">Entrar</Link>
            <Link to="/cadastro" className="uf-lp-btn compacto">Criar conta</Link>
          </div>
        </div>
      </header>

      <main id="conteudo">
        <section className="uf-lp-hero">
          <div className="uf-lp-hero-texto">
            <p className="uf-lp-overline">Gerenciador de treinos da sua academia</p>
            <h1>
              Seu treino não termina na <em>ficha.</em>
            </h1>
            <p className="uf-lp-hero-sub">
              O UniFit coloca a ficha da academia no seu bolso: consulte cada exercício
              com demonstração, registre série por série e acompanhe a carga subir
              semana após semana.
            </p>
            <div className="uf-lp-hero-acoes">
              <button type="button" className="uf-lp-btn" onClick={() => navigate('/cadastro')}>
                Criar conta de aluno
              </button>
              <button type="button" className="uf-lp-btn contorno" onClick={() => navigate('/login')}>
                Já tenho conta
              </button>
            </div>
            <p className="uf-lp-hero-adm">
              Administra uma academia? <Link to="/login?papel=admin">Acesso administrativo</Link>
            </p>
          </div>

          <aside className="uf-lp-ficha" aria-label="Exemplo de sessão de treino no UniFit">
            <div className="uf-lp-ficha-head">
              <span className="uf-lp-ficha-tag">Ficha A</span>
              <span className="uf-lp-ficha-nome">Peito e tríceps</span>
              <span className="uf-lp-ficha-live"><i aria-hidden="true" />Em andamento</span>
            </div>
            <figure className="uf-lp-ficha-media">
              <img src="/ExerciciosGif/Supino-reto-barra.gif" alt="Demonstração animada do supino reto com barra" />
              <figcaption>
                <strong>Supino reto com barra</strong>
                <span>1º de 6 exercícios</span>
              </figcaption>
            </figure>
            <dl className="uf-lp-ficha-dados">
              <div>
                <dt>Séries</dt>
                <dd>4</dd>
              </div>
              <div>
                <dt>Reps</dt>
                <dd>8–10</dd>
              </div>
              <div>
                <dt>Carga</dt>
                <dd>40<small>kg</small></dd>
              </div>
              <div>
                <dt>Descanso</dt>
                <dd>90<small>s</small></dd>
              </div>
            </dl>
            <ol className="uf-lp-ficha-series">
              <li className="feita">
                <span className="material-symbols-outlined" aria-hidden="true">check</span>
                <span className="uf-lp-serie-nome">Série 1</span>
                <b>10 × 36 kg</b>
              </li>
              <li className="atual">
                <span className="uf-lp-serie-agora" aria-hidden="true" />
                <span className="uf-lp-serie-nome">Série 2</span>
                <b>8 × 40 kg</b>
              </li>
              <li>
                <span className="uf-lp-serie-vazio" aria-hidden="true" />
                <span className="uf-lp-serie-nome">Série 3</span>
                <b>— × 40 kg</b>
              </li>
            </ol>
            <p className="uf-lp-ficha-nota">Sessão de exemplo. Os números aqui são os seus.</p>
          </aside>
        </section>

        <section className="uf-lp-secao" id="como-funciona">
          <header className="uf-lp-secao-head">
            <p className="uf-lp-overline">Como funciona</p>
            <h2>Da recepção ao rack, um caminho só.</h2>
          </header>
          <ol className="uf-lp-fluxo">
            <li>
              <span className="uf-lp-fluxo-n">01</span>
              <h3>A academia monta</h3>
              <p>A equipe da unidade cadastra o catálogo de exercícios e publica as fichas oficiais de treino.</p>
            </li>
            <li>
              <span className="uf-lp-fluxo-n">02</span>
              <h3>Você organiza</h3>
              <p>Salve uma ficha oficial na sua rotina ou monte listas pessoais com objetivo e dias da semana.</p>
            </li>
            <li>
              <span className="uf-lp-fluxo-n">03</span>
              <h3>O treino fica registrado</h3>
              <p>Inicie a sessão, marque cada série concluída, ajuste a carga e respeite o descanso.</p>
            </li>
          </ol>
        </section>

        <section className="uf-lp-sessao" aria-label="O produto em ação">
          <div className="uf-lp-sessao-inner">
            <div className="uf-lp-sessao-texto">
              <p className="uf-lp-overline clara">Produto em ação</p>
              <h2>Aperte iniciar e a ficha vira sessão.</h2>
              <p>
                Durante o treino, o UniFit cronometra a sessão, acompanha o descanso
                entre séries e guarda as cargas que você levantou. Na próxima vez,
                o exercício já abre com a sua última carga.
              </p>
            </div>
            <div className="uf-lp-sessao-painel">
              <div className="uf-lp-sessao-topo">
                <div>
                  <span className="uf-lp-rotulo">Tempo de sessão</span>
                  <strong className="uf-lp-timer">42:17</strong>
                </div>
                <div className="uf-lp-sessao-descanso">
                  <span className="uf-lp-rotulo">Descanso</span>
                  <strong>90 s</strong>
                </div>
              </div>
              <p className="uf-lp-sessao-ex">Agachamento livre — série 3 de 4</p>
              <ul className="uf-lp-sessao-series">
                <li className="feita">
                  <span className="material-symbols-outlined" aria-hidden="true">check</span>
                  Série 1
                  <b>10 × 60 kg</b>
                </li>
                <li className="feita">
                  <span className="material-symbols-outlined" aria-hidden="true">check</span>
                  Série 2
                  <b>10 × 60 kg</b>
                </li>
                <li className="atual">
                  <span className="uf-lp-serie-agora" aria-hidden="true" />
                  Série 3
                  <b>8 × 65 kg</b>
                </li>
                <li>
                  <span className="uf-lp-serie-vazio" aria-hidden="true" />
                  Série 4
                  <b>— × 65 kg</b>
                </li>
              </ul>
              <div className="uf-lp-historico">
                <span className="uf-lp-rotulo">Últimas cargas registradas</span>
                <div className="uf-lp-barras" role="img" aria-label="Histórico de carga do agachamento livre: 56, 60, 60, 62 e 65 quilos">
                  <span className="c1"><i /><em>56</em></span>
                  <span className="c2"><i /><em>60</em></span>
                  <span className="c3"><i /><em>60</em></span>
                  <span className="c4"><i /><em>62</em></span>
                  <span className="c5"><i /><em>65</em></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="uf-lp-secao" id="recursos">
          <header className="uf-lp-secao-head">
            <p className="uf-lp-overline">Recursos</p>
            <h2>O que você encontra dentro do UniFit.</h2>
          </header>

          <article className="uf-lp-rec">
            <div className="uf-lp-rec-texto">
              <span className="uf-lp-rec-n">01</span>
              <h3>Catálogo visual de exercícios</h3>
              <p>
                Cada exercício tem demonstração animada, grupo muscular e equipamento.
                Busque pelo nome, filtre por músculo e favorite os que entram na sua rotina.
              </p>
            </div>
            <figure className="uf-lp-rec-media">
              <img src={'/ExerciciosGif/' + encodeURIComponent('Puxada-Alta-na-Polia-_Lat-Pulldown_.gif')} alt="Demonstração animada da puxada alta na polia" />
              <figcaption>Puxada alta na polia — costas</figcaption>
            </figure>
          </article>

          <article className="uf-lp-rec invertido">
            <div className="uf-lp-rec-texto">
              <span className="uf-lp-rec-n">02</span>
              <h3>Fichas oficiais da academia</h3>
              <p>
                As listas montadas pela equipe da sua unidade chegam prontas, com séries,
                repetições, carga e descanso prescritos. Um toque para salvar na sua rotina.
              </p>
            </div>
            <figure className="uf-lp-rec-media">
              <img src="/image/academiaTCC.jpg" alt="Sala de musculação da academia" />
              <figcaption>Prescrição da equipe, execução sua</figcaption>
            </figure>
          </article>

          <article className="uf-lp-rec">
            <div className="uf-lp-rec-texto">
              <span className="uf-lp-rec-n">03</span>
              <h3>Listas pessoais do seu jeito</h3>
              <p>
                Monte a sua própria lista: escolha os exercícios, defina o objetivo e os
                dias da semana. A prescrição fica salva e você edita quando quiser.
              </p>
            </div>
            <div className="uf-lp-rec-media composta">
              <div className="uf-lp-dias" role="img" aria-label="Dias de treino: segunda, quarta e sexta">
                <span>D</span>
                <span className="ativo">S</span>
                <span>T</span>
                <span className="ativo">Q</span>
                <span>Q</span>
                <span className="ativo">S</span>
                <span>S</span>
              </div>
              <p className="uf-lp-presc">3 × 8–12 · 20 kg · 90 s de pausa</p>
              <span className="uf-lp-presc-legenda">Prescrição de um exercício da lista</span>
            </div>
          </article>

          <article className="uf-lp-rec invertido">
            <div className="uf-lp-rec-texto">
              <span className="uf-lp-rec-n">04</span>
              <h3>Registro e evolução</h3>
              <p>
                Marque as séries concluídas e ajuste a carga na hora. O histórico guarda
                as últimas cargas de cada exercício para você enxergar a progressão.
              </p>
            </div>
            <figure className="uf-lp-rec-media">
              <img src={'/ExerciciosGif/' + encodeURIComponent('Agachamento livre.gif')} alt="Demonstração animada do agachamento livre" />
              <figcaption>Agachamento livre — pernas</figcaption>
            </figure>
          </article>
        </section>

        <section className="uf-lp-academias" id="academias">
          <div className="uf-lp-academias-inner">
            <div className="uf-lp-academias-texto">
              <p className="uf-lp-overline azul">Para academias</p>
              <h2>A gestão do treino no mesmo lugar que o aluno.</h2>
              <p>
                No painel administrativo, a equipe da unidade cuida de tudo que o aluno
                vê no app: os alunos cadastrados, o catálogo de exercícios e as fichas
                oficiais com prescrição.
              </p>
            </div>
            <div className="uf-lp-academias-itens">
              <ul>
                <li>Gestão de alunos e administradores</li>
                <li>Catálogo de exercícios da unidade</li>
                <li>Fichas oficiais com séries, carga e descanso</li>
              </ul>
              <Link to="/login?papel=admin" className="uf-lp-link-adm">
                Acesso administrativo
                <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="uf-lp-final">
          <div className="uf-lp-final-aluno">
            <h2>Comece pelo próximo treino.</h2>
            <p>Crie sua conta, escolha sua ficha e registre a primeira sessão hoje.</p>
            <div className="uf-lp-final-acoes">
              <button type="button" className="uf-lp-btn" onClick={() => navigate('/cadastro')}>
                Criar conta de aluno
              </button>
              <Link to="/login" className="uf-lp-final-entrar">Já treino com o UniFit</Link>
            </div>
          </div>
          <div className="uf-lp-final-adm">
            <h3>É da equipe da academia?</h3>
            <p>Entre no painel para gerenciar alunos, catálogo e fichas oficiais.</p>
            <Link to="/login?papel=admin" className="uf-lp-link-adm">
              Acesso administrativo
              <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="uf-lp-footer">
        <div className="uf-lp-footer-inner">
          <div className="uf-lp-footer-marca">
            <a href="#inicio" className="uf-lp-brand">
              <img src="/image/logo.png" alt="UniFit" />
            </a>
            <p>Gerenciador de exercícios e listas de treino.</p>
          </div>
          <nav className="uf-lp-footer-nav" aria-label="Rodapé">
            <a href="#como-funciona">Como funciona</a>
            <a href="#recursos">Recursos</a>
            <a href="#academias">Para academias</a>
            <Link to="/login">Entrar</Link>
            <Link to="/cadastro">Criar conta</Link>
          </nav>
        </div>
        <p className="uf-lp-footer-copy">© 2026 UniFit</p>
      </footer>
    </div>
  );
}
