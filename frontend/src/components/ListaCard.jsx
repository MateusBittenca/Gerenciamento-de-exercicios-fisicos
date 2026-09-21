import { useNavigate } from 'react-router-dom';
import { DIAS_UI, exerciciosDaLista, formatPrescricao, OBJETIVOS, parseDias } from '../api/client';

function labelObjetivo(valor) {
  return (OBJETIVOS.find((item) => item.value === valor) || {}).label || valor || 'Lista';
}

export default function ListaCard({
  lista,
  onAbrir,
  onIniciar,
  onSalvar,
  onAdicionar,
  destaqueHoje
}) {
  const navigate = useNavigate();
  const meta = lista[0];
  const itens = exerciciosDaLista(lista);
  const dias = parseDias(meta.dias_semana);
  const vazia = itens.length === 0;

  return (
    <article className={'uf-card uf-list-card' + (destaqueHoje ? ' uf-hoje' : '')}>
      <div className="uf-chips">
        <span className="uf-chip" style={{ cursor: 'default' }}>{labelObjetivo(meta.objetivo)}</span>
        <span className="uf-chip" style={{ cursor: 'default' }}>Frequência {meta.tipo_lista}</span>
        {destaqueHoje && <span className="uf-chip ativo" style={{ cursor: 'default' }}>Hoje</span>}
      </div>
      <h3 style={onAbrir ? { cursor: 'pointer' } : undefined} onClick={onAbrir}>{meta.nome_lista}</h3>
      {dias.length > 0 && (
        <div className="uf-dias uf-dias-mini">
          {DIAS_UI.map((dia) => (
            <span key={dia.value + dia.label} className={'uf-dia' + (dias.includes(dia.value) ? ' ativo' : '')}>{dia.label}</span>
          ))}
        </div>
      )}
      <ul>
        {vazia ? (
          <li className="uf-muted" style={{ cursor: 'default' }}>Nenhum exercício ainda</li>
        ) : itens.slice(0, 5).map((exercicio) => (
          <li key={exercicio.id_exercicio} onClick={onAbrir}>
            {exercicio.nome_exercicio}
            {formatPrescricao(exercicio) ? <small className="uf-muted"> · {formatPrescricao(exercicio)}</small> : null}
          </li>
        ))}
      </ul>
      <div className="uf-actions" style={{ marginTop: 4 }}>
        {onSalvar && (
          <button type="button" className="uf-btn-outline" onClick={onSalvar}>
            <span className="material-symbols-outlined">bookmark_add</span>
            Salvar na rotina
          </button>
        )}
        {vazia && !onSalvar && (
          <button type="button" className="uf-btn-outline" onClick={onAdicionar || (() => navigate('/app/exercicios'))}>
            Adicionar exercícios
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
            <span className="material-symbols-outlined">play_arrow</span>
            Iniciar treino
          </button>
        )}
      </div>
    </article>
  );
}
