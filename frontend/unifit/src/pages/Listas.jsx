import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { listaService } from '../services/listaService';
import Swal from 'sweetalert2';
import '../styles/lista.css';

const Listas = () => {
  const [listas, setListas] = useState([]);
  const [exerciciosLista, setExerciciosLista] = useState([]);
  const [showExerciciosModal, setShowExerciciosModal] = useState(false);
  const [listaSelecionada, setListaSelecionada] = useState(null);

  useEffect(() => {
    carregarListas();
  }, []);

  const carregarListas = async () => {
    const result = await listaService.getListasRecomendadas();
    if (result.success) {
      setListas(result.data);
    }
  };

  const verExercicios = async (lista) => {
    setListaSelecionada(lista);
    const result = await listaService.getExerciciosLista(lista.idlista);
    if (result.success) {
      setExerciciosLista(result.data);
      setShowExerciciosModal(true);
    }
  };

  return (
    <div className="listas-page">
      <Sidebar />
      <div className="itens">
        <header className="page-header">
          <h1>Listas Recomendadas</h1>
          <p>Treinos criados por profissionais para você.</p>
        </header>

        {listas.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-inbox"></i>
            <h3>Nenhuma lista recomendada</h3>
            <p>Volte mais tarde para ver novos treinos</p>
          </div>
        ) : (
          <div className="listas-grid">
            {listas.map((lista) => (
              <article
                key={lista.idlista}
                className="lista-card"
                onClick={() => verExercicios(lista)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && verExercicios(lista)}
              >
                <div className="lista-card-header">
                  <div className="lista-icon">
                    <i className="bi bi-lightning-charge" aria-hidden></i>
                  </div>
                  <span className="lista-badge">{lista.tipo}</span>
                </div>
                <div className="lista-card-body">
                  <h3>{lista.nome}</h3>
                  <p>Ver exercícios</p>
                </div>
                <div className="lista-card-footer">
                  <span className="lista-card-cta">
                    <i className="bi bi-arrow-right" aria-hidden></i>
                    Abrir
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showExerciciosModal} onClose={() => setShowExerciciosModal(false)}>
        <h2>{listaSelecionada?.nome}</h2>
        <br />
        <table className="exercise-table">
          <thead>
            <tr>
              <th>Exercício</th>
              <th>Músculo</th>
            </tr>
          </thead>
          <tbody>
            {exerciciosLista.length === 0 ? (
              <tr>
                <td colSpan="2">Nenhum exercício nesta lista</td>
              </tr>
            ) : (
              exerciciosLista.map((exercicio) => (
                <tr key={exercicio.idexercicio}>
                  <td>{exercicio.nome}</td>
                  <td>{exercicio.musculo}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Modal>
    </div>
  );
};

export default Listas;
