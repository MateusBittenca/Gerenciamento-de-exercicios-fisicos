import { exerciseImageSrc } from '../api/client';

export default function ExerciseModal({ exercicio, onClose }) {
  if (!exercicio) {
    return null;
  }

  const nome = exercicio.nome || exercicio.nome_exercicio;
  const musculo = exercicio.musculo || exercicio.musculo_trabalhado;
  const tipo = exercicio.tipo || exercicio.tipo_exercicio;

  return (
    <div className="modal aberto">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>{nome}</h2>
        <br />
        <h3>Musculo: {musculo}</h3>
        <h3>Equipamento: {exercicio.equipamento}</h3>
        <h3>Dificuldade: {exercicio.dificuldade}</h3>
        <h3>Tipo: {tipo}</h3>
        <br />
        {exercicio.imagem && (
          <img src={exerciseImageSrc(exercicio.imagem)} alt="Imagem do exercício" />
        )}
        <br />
        <h4>{exercicio.instrucao}</h4>
      </div>
    </div>
  );
}
