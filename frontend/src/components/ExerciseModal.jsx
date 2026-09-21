import { exerciseImageSrc } from '../api/client';

export default function ExerciseModal({ exercicio, onClose }) {
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
        <h2>{nome}</h2>
        {imagem && (
          <img className="uf-gif" src={exerciseImageSrc(imagem)} alt={nome} style={{ marginTop: 16 }} />
        )}
        <div className="uf-meta">
          <div><strong>Músculo:</strong> {musculo}</div>
          <div><strong>Equipamento:</strong> {exercicio.equipamento}</div>
          <div><strong>Dificuldade:</strong> {exercicio.dificuldade}</div>
          <div><strong>Tipo:</strong> {tipo}</div>
        </div>
        <p>{exercicio.instrucao}</p>
      </div>
    </div>
  );
}
