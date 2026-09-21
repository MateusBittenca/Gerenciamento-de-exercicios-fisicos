import { exerciseImageSrc } from '../api/client';

export default function ExerciseCard({ exercicio, compact = false, onOpen, onAdd }) {
  return (
    <article className="uf-card uf-ex-card">
      <div onClick={onOpen}>
        {exercicio.imagem ? (
          <img src={exerciseImageSrc(exercicio.imagem)} alt={exercicio.nome} />
        ) : (
          <div style={{ height: compact ? 140 : 192, background: '#F5F3F4' }} />
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
