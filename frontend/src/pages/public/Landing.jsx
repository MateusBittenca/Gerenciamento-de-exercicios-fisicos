import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import Reveal from '../../components/Reveal';
import { DUR, EASE, fadeUp, staggerParent, tap } from '../../motion';
import '../../css/landing.css';

const MotionLink = motion.create(Link);

/* Traço do instrutor: desce a margem esquerda, passa sob o texto, sobe atrás da ficha. */
const ONDA =
  'M 118 -50 C 132 150 102 340 130 520 C 155 640 400 670 700 650 C 980 630 1050 40 1260 80 C 1480 120 1420 580 1600 720';

const barras = [
  { cls: 'c1', valor: '56', delay: 0 },
  { cls: 'c2', valor: '60', delay: 0.05 },
  { cls: 'c3', valor: '60', delay: 0.1 },
  { cls: 'c4', valor: '62', delay: 0.15 },
  { cls: 'c5', valor: '65', delay: 0.2 }
];

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
            <MotionLink to="/cadastro" className="uf-lp-btn compacto" whileTap={tap}>
              Criar conta
            </MotionLink>
          </div>
        </div>
      </header>

      <main id="conteudo">
        <div className="uf-lp-hero-wrap">
          <svg className="uf-lp-onda" viewBox="0 0 1440 820" preserveAspectRatio="none" aria-hidden="true">
            <motion.path
              className="uf-lp-onda-faixa"
              d={ONDA}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, ease: EASE }}
            />
            <motion.path
              className="uf-lp-onda-eco"
              d={ONDA}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.6, delay: 0.12, ease: EASE }}
            />
            <motion.path
              className="uf-lp-onda-traco"
              d={ONDA}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.8, ease: EASE }}
            />
          </svg>
        <section className="uf-lp-hero">
          <motion.div
            className="uf-lp-hero-texto"
            variants={staggerParent}
            initial="hidden"
            animate="show"
          >
            <motion.p className="uf-lp-overline" variants={fadeUp}>
              Gerenciador de treinos da sua academia
            </motion.p>
            <motion.h1 variants={fadeUp}>
              Seu treino não termina na <em>ficha.</em>
            </motion.h1>
            <motion.p className="uf-lp-hero-sub" variants={fadeUp}>
              O UniFit coloca a ficha da academia no seu bolso: consulte cada exercício
              com demonstração, registre série por série e acompanhe a carga subir
              semana após semana.
            </motion.p>
            <motion.div className="uf-lp-hero-acoes" variants={fadeUp}>
              <motion.button type="button" className="uf-lp-btn" whileTap={tap} onClick={() => navigate('/cadastro')}>
                Criar conta de aluno
              </motion.button>
              <motion.button type="button" className="uf-lp-btn contorno" whileTap={tap} onClick={() => navigate('/login')}>
                Já tenho conta
              </motion.button>
            </motion.div>
            <motion.p className="uf-lp-hero-adm" variants={fadeUp}>
              Administra uma academia? <Link to="/login?papel=admin">Acesso administrativo</Link>
            </motion.p>
          </motion.div>

          <motion.aside
            className="uf-lp-ficha"
            aria-label="Exemplo de sessão de treino no UniFit"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease: EASE }}
          >
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
            <motion.ol
              className="uf-lp-ficha-series"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.08, delayChildren: 0.38 } }
              }}
              initial="hidden"
              animate="show"
            >
              <motion.li className="feita" variants={fadeUp}>
                <span className="material-symbols-outlined" aria-hidden="true">check</span>
                <span className="uf-lp-serie-nome">Série 1</span>
                <b>10 × 36 kg</b>
              </motion.li>
              <motion.li className="atual" variants={fadeUp}>
                <span className="uf-lp-serie-agora" aria-hidden="true" />
                <span className="uf-lp-serie-nome">Série 2</span>
                <b>8 × 40 kg</b>
              </motion.li>
              <motion.li variants={fadeUp}>
                <span className="uf-lp-serie-vazio" aria-hidden="true" />
                <span className="uf-lp-serie-nome">Série 3</span>
                <b>— × 40 kg</b>
              </motion.li>
            </motion.ol>
            <p className="uf-lp-ficha-nota">Sessão de exemplo. Os números aqui são os seus.</p>
          </motion.aside>
        </section>
        </div>

        <section className="uf-lp-secao" id="como-funciona">
          <Reveal as="header" className="uf-lp-secao-head">
            <p className="uf-lp-overline">Como funciona</p>
            <h2>Da recepção ao rack, um caminho só.</h2>
          </Reveal>
          <Reveal as="ol" className="uf-lp-fluxo" stagger>
            <motion.li variants={fadeUp}>
              <span className="uf-lp-fluxo-n">01</span>
              <h3>A academia monta</h3>
              <p>A equipe da unidade cadastra o catálogo de exercícios e publica as fichas oficiais de treino.</p>
            </motion.li>
            <motion.li variants={fadeUp}>
              <span className="uf-lp-fluxo-n">02</span>
              <h3>Você organiza</h3>
              <p>Salve uma ficha oficial na sua rotina ou monte listas pessoais com objetivo e dias da semana.</p>
            </motion.li>
            <motion.li variants={fadeUp}>
              <span className="uf-lp-fluxo-n">03</span>
              <h3>O treino fica registrado</h3>
              <p>Inicie a sessão, marque cada série concluída, ajuste a carga e respeite o descanso.</p>
            </motion.li>
          </Reveal>
        </section>

        <section className="uf-lp-sessao" aria-label="O produto em ação">
          <div className="uf-lp-sessao-inner">
            <Reveal className="uf-lp-sessao-texto">
              <p className="uf-lp-overline clara">Produto em ação</p>
              <h2>Aperte iniciar e a ficha vira sessão.</h2>
              <p>
                Durante o treino, o UniFit cronometra a sessão, acompanha o descanso
                entre séries e guarda as cargas que você levantou. Na próxima vez,
                o exercício já abre com a sua última carga.
              </p>
            </Reveal>
            <Reveal className="uf-lp-sessao-painel" delay={0.08}>
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
                  {barras.map((barra) => (
                    <span key={barra.cls} className={barra.cls}>
                      <motion.i
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true, amount: 0.6 }}
                        transition={{ duration: DUR, delay: barra.delay, ease: EASE }}
                      />
                      <em>{barra.valor}</em>
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="uf-lp-secao" id="recursos">
          <Reveal as="header" className="uf-lp-secao-head">
            <p className="uf-lp-overline">Recursos</p>
            <h2>O que você encontra dentro do UniFit.</h2>
          </Reveal>

          <Reveal as="article" className="uf-lp-rec">
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
          </Reveal>

          <Reveal as="article" className="uf-lp-rec invertido">
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
          </Reveal>

          <Reveal as="article" className="uf-lp-rec">
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
          </Reveal>

          <Reveal as="article" className="uf-lp-rec invertido">
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
          </Reveal>
        </section>

        <section className="uf-lp-academias" id="academias">
          <div className="uf-lp-academias-inner">
            <Reveal className="uf-lp-academias-texto">
              <p className="uf-lp-overline azul">Para academias</p>
              <h2>A gestão do treino no mesmo lugar que o aluno.</h2>
              <p>
                No painel administrativo, a equipe da unidade cuida de tudo que o aluno
                vê no app: os alunos cadastrados, o catálogo de exercícios e as fichas
                oficiais com prescrição.
              </p>
            </Reveal>
            <Reveal className="uf-lp-academias-itens" delay={0.06}>
              <ul>
                <li>Gestão de alunos e administradores</li>
                <li>Catálogo de exercícios da unidade</li>
                <li>Fichas oficiais com séries, carga e descanso</li>
              </ul>
              <MotionLink to="/login?papel=admin" className="uf-lp-link-adm" whileTap={tap}>
                Acesso administrativo
                <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
              </MotionLink>
            </Reveal>
          </div>
        </section>

        <section className="uf-lp-final">
          <Reveal className="uf-lp-final-aluno">
            <h2>Comece pelo próximo treino.</h2>
            <p>Crie sua conta, escolha sua ficha e registre a primeira sessão hoje.</p>
            <div className="uf-lp-final-acoes">
              <motion.button type="button" className="uf-lp-btn" whileTap={tap} onClick={() => navigate('/cadastro')}>
                Criar conta de aluno
              </motion.button>
              <Link to="/login" className="uf-lp-final-entrar">Já treino com o UniFit</Link>
            </div>
          </Reveal>
          <Reveal className="uf-lp-final-adm" delay={0.06}>
            <h3>É da equipe da academia?</h3>
            <p>Entre no painel para gerenciar alunos, catálogo e fichas oficiais.</p>
            <MotionLink to="/login?papel=admin" className="uf-lp-link-adm" whileTap={tap}>
              Acesso administrativo
              <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
            </MotionLink>
          </Reveal>
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
