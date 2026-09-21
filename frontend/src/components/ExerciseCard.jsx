import { exerciseImageSrc } from '../api/client';

export default function ExerciseCard({ exercicio, compact = false, onOpen, onAdd, favorito, onFav }) {
  return (
    <article className="uf-card uf-ex-card">
      <div onClick={onOpen} style={{ position: 'relative' }}>
        {exercicio.imagem ? (
          <img src={exerciseImageSrc(exercicio.imagem)} alt={exercicio.nome} />
        ) : (
          <div style={{ height: compact ? 140 : 192, background: '#F5F3F4' }} />
        )}
        {onFav && (
          <button
            type="button"
            className={'uf-fav' + (favorito ? ' ativo' : '')}
            onClick={(e) => { e.stopPropagation(); onFav(exercicio); }}
            aria-label="Favoritar"
          >
            <span className="material-symbols-outlined" style={favorito ? { fontVariationSettings: "'FILL' 1" } : undefined}>favorite</span>
          </button>
        )}
      </div>
      <div className="uf-ex-card-body">
        <h3 onClick={onOpen} style={{ cursor: 'pointer' }}>{exercicio.nome}</h3>
        <div className="uf-ex-card-foot">
          <span className="uf-chip" style={{ cursor: 'default' }}>{exercicio.musculo}</span>
          {onAdd && (
            <button type="button" className="uf-add" onClick={() => onAdd(exercicio)} aria-label="Adicionar à lista">
              <span className="material-symbols-outlined">add</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
