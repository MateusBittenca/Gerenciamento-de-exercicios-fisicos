import { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import { getImagePath } from '../utils/imageHelper';

const ExercicioCard = ({ exercicio, onAddToList, showAddButton = false }) => {
  const [showModal, setShowModal] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);
  const imagePath = getImagePath(exercicio.imagem);

  // Só carrega a imagem do card quando ele entra na viewport (menos GIFs na memória)
  useEffect(() => {
    if (!cardRef.current || !imagePath) return;
    const el = cardRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { rootMargin: '100px', threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [imagePath]);

  return (
    <>
      <div className="card" ref={cardRef}>
        <div className="card-content" onClick={() => setShowModal(true)}>
          <h3>{exercicio.nome}</h3>
          <p>Musculo: {exercicio.musculo}</p>
          {imagePath ? (
            <div className="card-image-wrap">
              {!isInView ? (
                <div className="card-image-placeholder" aria-hidden />
              ) : (
                <>
                  {!imageLoaded && <div className="card-image-placeholder" aria-hidden />}
                  <img
                    src={imagePath}
                    alt={exercicio.nome}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => setImageLoaded(true)}
                    style={{ opacity: imageLoaded ? 1 : 0 }}
                  />
                </>
              )}
            </div>
          ) : null}
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
          <img src={imagePath} alt={exercicio.nome} style={{ maxWidth: '100%' }} loading="lazy" decoding="async" />
        )}
        <br />
        <h4>{exercicio.instrucao}</h4>
      </Modal>
    </>
  );
};

export default ExercicioCard;
