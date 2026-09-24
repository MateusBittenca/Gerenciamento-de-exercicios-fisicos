import { classeDificuldade, exerciseImageSrc } from '../api/client';

export default function ExerciseCard({ exercicio, compact = false, onOpen, onAdd, favorito, onFav }) {
  return (
    <article className="uf-card uf-ex-card">
      <div className="uf-ex-card-media" onClick={onOpen} style={{ height: compact ? 140 : 192, cursor: 'pointer' }}>
        {exercicio.imagem ? (
          <img src={exerciseImageSrc(exercicio.imagem)} alt={exercicio.nome} />
        ) : null}
        <div className="uf-ex-card-badges">
          {exercicio.musculo ? <span className="uf-badge-soft">{exercicio.musculo}</span> : null}
        </div>
        {exercicio.equipamento ? <span className="uf-ex-card-equip">{exercicio.equipamento}</span> : null}
        {onFav && (
          <button
            type="button"
            className={'uf-fav' + (favorito ? ' ativo' : '')}
            onClick={(e) => { e.stopPropagation(); onFav(exercicio); }}
            aria-label="Favoritar"
            style={{ zIndex: 2 }}
          >
            <span className="material-symbols-outlined" style={favorito ? { fontVariationSettings: "'FILL' 1" } : undefined}>favorite</span>
          </button>
        )}
      </div>
      <div className="uf-ex-card-body">
        <div className="uf-ex-card-meta">
          <span className={classeDificuldade(exercicio.dificuldade) || undefined}>{exercicio.dificuldade || 'Catálogo'}</span>
          {exercicio.tipo ? <span>{exercicio.tipo}</span> : null}
        </div>
        <h3 onClick={onOpen} style={{ cursor: 'pointer' }}>{exercicio.nome}</h3>
        {exercicio.instrucao && !compact ? <p>{exercicio.instrucao}</p> : null}
      </div>
      {compact ? (
        <div className="uf-ex-card-foot" style={{ padding: '0 16px 16px' }}>
          <span className="uf-chip" style={{ cursor: 'default' }}>{exercicio.musculo}</span>
          {onAdd && (
            <button type="button" className="uf-add" onClick={() => onAdd(exercicio)} aria-label="Adicionar à lista">
              <span className="material-symbols-outlined">add</span>
            </button>
          )}
        </div>
      ) : (
        <div className="uf-ex-card-actions">
          <button type="button" className="uf-btn-ghost" onClick={onOpen}>
            <span className="material-symbols-outlined">info</span>
            Ver detalhes
          </button>
          {onAdd && (
            <button type="button" className="uf-btn-outline" onClick={() => onAdd(exercicio)}>
              <span className="material-symbols-outlined">add_circle</span>
              Adicionar à lista
            </button>
          )}
        </div>
      )}
    </article>
  );
}
