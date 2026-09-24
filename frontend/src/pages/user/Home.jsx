import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { useFeedback } from '../../auth/FeedbackContext';
import {
  exerciciosDaLista,
  formatCronometro,
  formatPrescricao,
  groupListsById,
  OBJETIVOS,
  parseDias,
  segundosDesde
} from '../../api/client';

const DIAS = [
  { value: 1, curto: 'Seg' },
  { value: 2, curto: 'Ter' },
  { value: 3, curto: 'Qua' },
  { value: 4, curto: 'Qui' },
  { value: 5, curto: 'Sex' },
  { value: 6, curto: 'Sáb' },
  { value: 0, curto: 'Dom' }
];

const NOME_DIA = {
  0: 'Domingo',
  1: 'Segunda',
  2: 'Terça',
  3: 'Quarta',
  4: 'Quinta',
  5: 'Sexta',
  6: 'Sábado'
};

function labelObjetivo(valor) {
  return (OBJETIVOS.find((item) => item.value === valor) || {}).label || valor || 'Lista';
}

function diasTexto(dias) {
  return DIAS.filter((dia) => dias.includes(dia.value)).map((dia) => dia.curto).join(' · ');
}

function dataLonga(data) {
  const texto = data.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

export default function Home() {
  const { payload, request, refreshSessao, sessaoAtiva } = useAuth();
  const { toast } = useFeedback();
  const navigate = useNavigate();
  const [minhas, setMinhas] = useState([]);
  const [treinosMes, setTreinosMes] = useState(0);
  const [pronto, setPronto] = useState(false);
  const [dia, setDia] = useState(() => new Date().getDay());
  const [escolha, setEscolha] = useState(null);
  const [decorrido, setDecorrido] = useState('00:00:00');

  useEffect(() => {
    let vivo = true;
    async function carregar() {
      try {
        const minhasRes = await request('/lista/exercicios/' + payload.usuarioId, { method: 'get' });
        if (vivo && minhasRes.status === true) {
          setMinhas(minhasRes.dados || []);
        }
        const resumo = await request('/treino/resumo', { method: 'get' });
        if (vivo && resumo.status === true) {
          setTreinosMes((resumo.dados && resumo.dados.concluidasMes) || 0);
        }
      } finally {
        if (vivo) {
          setPronto(true);
        }
      }
    }
    carregar();
    return () => {
      vivo = false;
    };
  }, [payload.usuarioId, request]);

  const sessao = sessaoAtiva && sessaoAtiva.sessao;
  const aoVivo = sessao && sessao.status === 'em_andamento';

  useEffect(() => {
    if (!aoVivo) {
      return undefined;
    }
    function marcar() {
      setDecorrido(formatCronometro(segundosDesde(sessao.iniciada_em)));
    }
    marcar();
    const id = setInterval(marcar, 1000);
    return () => clearInterval(id);
  }, [aoVivo, sessao]);

  async function iniciar(idLista) {
    const obj = await request('/treino/iniciar', {
      method: 'post',
      body: JSON.stringify({ idLista })
    });
    if (obj.status === true && obj.dados && obj.dados.sessao) {
      await refreshSessao();
      navigate('/app/treino/' + obj.dados.sessao.id);
    } else {
      toast('erro', obj.msg || 'Não foi possível iniciar o treino.');
    }
  }

  function abrirTreino(idLista) {
    if (aoVivo && String(sessao.lista_id) === String(idLista)) {
      navigate('/app/treino/' + sessao.id);
      return;
    }
    if (aoVivo) {
      toast('info', 'Encerre o treino em andamento antes de começar outro.');
      return;
    }
    iniciar(idLista);
  }

  const hoje = new Date().getDay();
  const agrupadas = groupListsById(minhas);
  const fichas = Object.keys(agrupadas).map((idLista) => {
    const lista = agrupadas[idLista];
    const meta = lista[0];
    return {
      id: meta.id_lista,
      meta,
      itens: exerciciosDaLista(lista),
      dias: parseDias(meta.dias_semana)
    };
  });
  const doDia = fichas.filter((ficha) => ficha.dias.includes(dia));
  const ficha = doDia.find((item) => String(item.id) === String(escolha)) || doDia[0] || null;
  const resto = fichas.filter((item) => !ficha || String(item.id) !== String(ficha.id));
  const mesLabel = treinosMes === 0
    ? 'Nenhum treino neste mês'
    : treinosMes === 1
      ? '1 treino neste mês'
      : treinosMes + ' treinos neste mês';

  function escolherDia(valor) {
    setDia(valor);
    setEscolha(null);
  }

  useEffect(() => {
    const ativo = document.querySelector('.uf-home .uf-week-day.ativo');
    if (ativo) {
      ativo.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    }
  }, [dia, pronto]);

  if (!pronto) {
    return <div className="uf-home" />;
  }

  return (
    <div className="uf-home">
      <header className="uf-home-top">
        <p className="uf-home-date">{dataLonga(new Date())}</p>
        <p className="uf-home-mes">{mesLabel}</p>
      </header>

      {aoVivo && (
        <button type="button" className="uf-live" onClick={() => navigate('/app/treino/' + sessao.id)}>
          <i />
          <span>
            <small>Em andamento</small>
            <strong>{sessao.nome_lista || 'Treino'}</strong>
          </span>
          <b>{decorrido}</b>
          <em>Retomar</em>
        </button>
      )}

      {fichas.length === 0 ? (
        <section className="uf-sheet">
          <div className="uf-sheet-head">
            <div>
              <p className="uf-sheet-kicker">Hoje</p>
              <h1>Sem lista de treino</h1>
              <p className="uf-sheet-sub">Crie a sua ou comece por uma lista da academia.</p>
            </div>
          </div>
          <div className="uf-sheet-actions">
            <button type="button" className="uf-btn-primary" onClick={() => navigate('/app/minhas-listas')}>
              Criar lista
            </button>
            <button type="button" className="uf-btn-ghost" onClick={() => navigate('/app/listas')}>
              Listas da academia
            </button>
          </div>
        </section>
      ) : (
        <>
          <div className="uf-week" role="tablist" aria-label="Dias da semana">
            {DIAS.map((item) => {
              const marcadas = fichas.filter((fichaDia) => fichaDia.dias.includes(item.value));
              const classes = ['uf-week-day'];
              if (dia === item.value) {
                classes.push('ativo');
              }
              if (item.value === hoje) {
                classes.push('hoje');
              }
              return (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={dia === item.value}
                  className={classes.join(' ')}
                  onClick={() => escolherDia(item.value)}
                >
                  <span>{item.curto}</span>
                  {marcadas.length === 0 ? (
                    <em>—</em>
                  ) : marcadas.slice(0, 2).map((marcada) => (
                    <strong key={marcada.id}>{marcada.meta.nome_lista}</strong>
                  ))}
                </button>
              );
            })}
          </div>

          {ficha ? (
            <FichaDia
              ficha={ficha}
              doDia={doDia}
              kicker={dia === hoje ? 'Hoje' : NOME_DIA[dia]}
              aoVivo={aoVivo && String(sessao.lista_id) === String(ficha.id)}
              onEscolher={setEscolha}
              onTreinar={() => abrirTreino(ficha.id)}
              onMontar={() => navigate('/app/exercicios')}
            />
          ) : (
            <p className="uf-home-livre">
              {dia === hoje ? 'Hoje' : NOME_DIA[dia]} sem treino marcado.
            </p>
          )}

          <section className="uf-listas">
            <div className="uf-listas-head">
              <h2>Suas listas</h2>
              <button type="button" className="uf-home-text" onClick={() => navigate('/app/minhas-listas')}>
                Gerir
              </button>
            </div>
            <div className="uf-card uf-listas-card">
              {resto.map((item) => (
                <div className="uf-lista-row" key={item.id}>
                  <div className="uf-lista-main">
                    <strong>{item.meta.nome_lista}</strong>
                    <span>{resumoLista(item)}</span>
                  </div>
                  {item.itens.length === 0 ? (
                    <button type="button" className="uf-home-go" onClick={() => navigate('/app/exercicios')}>
                      Montar
                    </button>
                  ) : (
                    <button type="button" className="uf-home-go" onClick={() => abrirTreino(item.id)}>
                      <span className="material-symbols-outlined">play_arrow</span>
                      {aoVivo && String(sessao.lista_id) === String(item.id) ? 'Retomar' : 'Começar'}
                    </button>
                  )}
                </div>
              ))}
              <button type="button" className="uf-lista-nova" onClick={() => navigate('/app/minhas-listas')}>
                <span className="material-symbols-outlined">add</span>
                Nova lista
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function resumoLista(ficha) {
  const partes = [labelObjetivo(ficha.meta.objetivo)];
  const dias = diasTexto(ficha.dias);
  if (dias) {
    partes.push(dias);
  }
  if (ficha.itens.length === 0) {
    partes.push('sem exercícios');
  } else {
    partes.push(ficha.itens.length === 1 ? '1 exercício' : ficha.itens.length + ' exercícios');
  }
  return partes.join(' · ');
}

function FichaDia({ ficha, doDia, kicker, aoVivo, onEscolher, onTreinar, onMontar }) {
  const vazia = ficha.itens.length === 0;
  return (
    <section className="uf-sheet" aria-live="polite">
      <div className="uf-sheet-head">
        <div>
          <p className="uf-sheet-kicker">{kicker}</p>
          {doDia.length > 1 && (
            <div className="uf-sheet-switch" role="tablist" aria-label="Listas deste dia">
              {doDia.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={String(item.id) === String(ficha.id)}
                  className={String(item.id) === String(ficha.id) ? 'ativo' : ''}
                  onClick={() => onEscolher(item.id)}
                >
                  {item.meta.nome_lista}
                </button>
              ))}
            </div>
          )}
          <h1>{ficha.meta.nome_lista}</h1>
          <p className="uf-sheet-sub">
            {labelObjetivo(ficha.meta.objetivo)}
            {ficha.meta.tipo_lista ? ' · Frequência ' + ficha.meta.tipo_lista : ''}
            {vazia ? '' : ' · ' + (ficha.itens.length === 1 ? '1 exercício' : ficha.itens.length + ' exercícios')}
          </p>
          {vazia && <p className="uf-sheet-vazio">Esta lista ainda não tem exercício.</p>}
        </div>
        {vazia ? (
          <button type="button" className="uf-btn-primary" onClick={onMontar}>Montar</button>
        ) : (
          <button type="button" className="uf-btn-primary" onClick={onTreinar}>
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
            {aoVivo ? 'Retomar' : 'Começar'}
          </button>
        )}
      </div>
      {!vazia && (
        <ol className="uf-sheet-list">
          {ficha.itens.map((exercicio, indice) => (
            <li key={exercicio.id_exercicio}>
              <span className="uf-sheet-n">{String(indice + 1).padStart(2, '0')}</span>
              <span className="uf-sheet-name">
                <strong>{exercicio.nome_exercicio}</strong>
                {(exercicio.musculo_trabalhado || exercicio.musculo) && (
                  <em>{exercicio.musculo_trabalhado || exercicio.musculo}</em>
                )}
              </span>
              <span className="uf-sheet-presc">{formatPrescricao(exercicio) || '—'}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
