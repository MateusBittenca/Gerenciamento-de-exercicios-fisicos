import { useNavigate } from 'react-router-dom';
import { DIAS_UI, exerciciosDaLista, OBJETIVOS, parseDias } from '../api/client';

function labelObjetivo(valor) {
  return (OBJETIVOS.find((item) => item.value === valor) || {}).label || valor || 'Lista';
}

function prescCurta(exercicio) {
  if (!exercicio || !exercicio.series) {
    return '';
  }
  return exercicio.series + '×' + (exercicio.reps || '10');
}

export default function ListaCard({
  lista,
  onAbrir,
  onIniciar,
  onSalvar,
  onAdicionar,
  onExercicio,
  destaqueHoje,
  oficial
}) {
  const navigate = useNavigate();
  const meta = lista[0];
  const itens = exerciciosDaLista(lista);
  const dias = parseDias(meta.dias_semana);
  const vazia = itens.length === 0;
  const extra = Math.max(0, itens.length - 3);

  return (
    <article className={'uf-card uf-list-card' + (destaqueHoje ? ' uf-hoje' : '')}>
      {destaqueHoje ? <div className="uf-list-accent" /> : null}
      <div className="uf-list-top">
        {oficial ? (
          <span className="uf-badge-soft">
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>verified</span>
            Oficial UniFit
          </span>
        ) : (
          <span className="uf-badge-muted">Pessoal</span>
        )}
        {destaqueHoje ? (
          <span className="uf-badge-soft">Programado hoje</span>
        ) : null}
      </div>
      <p className="uf-list-meta">{labelObjetivo(meta.objetivo)} · Frequência {meta.tipo_lista}</p>
      <h3 style={onAbrir ? { cursor: 'pointer' } : undefined} onClick={onAbrir}>{meta.nome_lista}</h3>
      {dias.length > 0 && (
        <div className="uf-dias uf-dias-mini">
          {DIAS_UI.map((dia) => (
            <span key={dia.value + dia.label} className={'uf-dia' + (dias.includes(dia.value) ? ' ativo' : '')}>{dia.label}</span>
          ))}
        </div>
      )}
      {oficial ? (
        <div className="uf-list-rows">
          {vazia ? (
            <p className="uf-muted" style={{ margin: 0 }}>Nenhum exercício ainda</p>
          ) : itens.slice(0, 4).map((exercicio) => (
            <button
              type="button"
              className="uf-list-row"
              key={exercicio.id_exercicio}
              onClick={() => (onExercicio ? onExercicio(exercicio) : onAbrir && onAbrir())}
            >
              <div className="uf-list-row-main">
                <div className="uf-list-row-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>fitness_center</span>
                </div>
                <div>
                  <strong>{exercicio.nome_exercicio}</strong>
                  <span>{exercicio.musculo_trabalhado || exercicio.musculo || 'Exercício'}</span>
                </div>
              </div>
              {prescCurta(exercicio) ? <span className="uf-list-row-presc">{prescCurta(exercicio)}</span> : null}
            </button>
          ))}
        </div>
      ) : (
        <div className="uf-list-tags">
          {vazia ? (
            <span className="uf-list-tag mais">Nenhum exercício ainda</span>
          ) : itens.slice(0, 3).map((exercicio) => (
            <span key={exercicio.id_exercicio} className="uf-list-tag">{exercicio.nome_exercicio}</span>
          ))}
          {extra > 0 ? <span className="uf-list-tag mais">+{extra} outros</span> : null}
        </div>
      )}
      <div className="uf-list-foot">
        <span>
          <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle' }}>fitness_center</span>
          {' '}{itens.length} exercício{itens.length === 1 ? '' : 's'}
        </span>
        <div className="uf-actions">
          {onSalvar && (
            <button type="button" className="uf-btn-outline" onClick={onSalvar}>
              Salvar na rotina
            </button>
          )}
          {vazia && !onSalvar && (
            <button type="button" className="uf-btn-ghost" onClick={onAdicionar || (() => navigate('/app/exercicios'))}>
              Adicionar
            </button>
          )}
          {onIniciar && (
            <button
              type="button"
              className="uf-btn-primary"
              onClick={onIniciar}
              disabled={vazia}
              title={vazia ? 'Adicione um exercício para treinar' : 'Começar agora'}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
              Iniciar
            </button>
          )}
          {!onIniciar && onAbrir && (
            <button type="button" className="uf-btn-ghost" onClick={onAbrir}>Ver treino</button>
          )}
        </div>
      </div>
    </article>
  );
}
