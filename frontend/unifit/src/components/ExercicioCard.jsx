import { useState } from 'react';
import Modal from './Modal';
import { getImagePath } from '../utils/imageHelper';

const ExercicioCard = ({ exercicio, onAddToList, showAddButton = false }) => {
  const [showModal, setShowModal] = useState(false);
  const imagePath = getImagePath(exercicio.imagem);

  return (
    <>
      <div className="card">
        <div className="card-content" onClick={() => setShowModal(true)}>
          <h3>{exercicio.nome}</h3>
          <p>Musculo: {exercicio.musculo}</p>
          {imagePath && (
            <img src={imagePath} alt={exercicio.nome} />
          )}
        </div>
        {showAddButton && onAddToList && (
          <label className="ui-bookmark" onClick={() => onAddToList(exercicio)}>
            <div className="bookmark">
              <i className="bi bi-plus-lg"></i>
            </div>
          </label>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2>{exercicio.nome}</h2>
        <br />
        <h3>Musculo: {exercicio.musculo}</h3>
        <h3>Equipamento: {exercicio.equipamento}</h3>
        <h3>Dificuldade: {exercicio.dificuldade}</h3>
        <h3>Tipo: {exercicio.tipo}</h3>
        <br />
        {imagePath && (
          <img src={imagePath} alt={exercicio.nome} style={{ maxWidth: '100%' }} />
        )}
        <br />
        <h4>{exercicio.instrucao}</h4>
      </Modal>
    </>
  );
};

export default ExercicioCard;
