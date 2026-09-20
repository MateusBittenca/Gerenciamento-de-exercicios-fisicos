import { exerciseImageSrc } from '../api/client';

export default function ExerciseCard({ exercicio, compact = false, onOpen, onAdd }) {
  return (
    <div className="card">
      <div className="card-content" onClick={onOpen}>
        {compact ? <h5>{exercicio.nome}</h5> : <h3>{exercicio.nome}</h3>}
        {compact ? (
          <h5>Musculo:{exercicio.musculo}</h5>
        ) : (
          <p>Musculo:{exercicio.musculo}</p>
        )}
        {exercicio.imagem && (
          <img src={exerciseImageSrc(exercicio.imagem)} alt="Imagem do exercício" />
        )}
      </div>
      {onAdd && (
        <label className="ui-bookmark" onClick={(e) => {
          e.preventDefault();
          onAdd(exercicio);
        }}>
          <div className="bookmark">
            <i className="bi bi-plus-lg"></i>
          </div>
        </label>
      )}
    </div>
  );
}
