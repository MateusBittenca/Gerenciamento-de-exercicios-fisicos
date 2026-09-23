import { exerciseImageSrc } from '../api/client';

export default function ExerciseModal({ exercicio, onClose, favorito, onFav }) {
  if (!exercicio) {
    return null;
  }

  const nome = exercicio.nome || exercicio.nome_exercicio;
  const musculo = exercicio.musculo || exercicio.musculo_trabalhado;
  const tipo = exercicio.tipo || exercicio.tipo_exercicio;
  const imagem = exercicio.imagem;

  return (
    <div className="uf-modal" onClick={onClose}>
      <div className="uf-modal-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="uf-modal-close" onClick={onClose}>&times;</button>
        <p className="uf-kicker" style={{ marginBottom: 8 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>fitness_center</span>
          {musculo || 'Exercício'}
        </p>
        <div className="uf-page-head" style={{ marginBottom: 8 }}>
          <h2>{nome}</h2>
          {onFav && (
            <button type="button" className={'uf-fav' + (favorito ? ' ativo' : '')} onClick={() => onFav(exercicio)}>
              <span className="material-symbols-outlined" style={favorito ? { fontVariationSettings: "'FILL' 1" } : undefined}>favorite</span>
            </button>
          )}
        </div>
        {imagem && (
          <img className="uf-gif" src={exerciseImageSrc(imagem)} alt={nome} style={{ marginTop: 16, borderRadius: 12 }} />
        )}
        <div className="uf-meta">
          <div><strong>Músculo</strong><span>{musculo || '—'}</span></div>
          <div><strong>Equipamento</strong><span>{exercicio.equipamento || '—'}</span></div>
          <div><strong>Dificuldade</strong><span>{exercicio.dificuldade || '—'}</span></div>
          <div><strong>Tipo</strong><span>{tipo || '—'}</span></div>
        </div>
        {exercicio.instrucao ? <p style={{ color: 'var(--uf-text-2)', lineHeight: '24px' }}>{exercicio.instrucao}</p> : null}
      </div>
    </div>
  );
}
