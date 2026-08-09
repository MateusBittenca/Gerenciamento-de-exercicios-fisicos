import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import ExercicioCard from '../components/ExercicioCard';
import Modal from '../components/Modal';
import { exercicioService } from '../services/exercicioService';
import { listaService } from '../services/listaService';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import '../styles/exercicios.css';

const Exercicios = () => {
  const [exercicios, setExercicios] = useState([]);
  const [exerciciosFiltrados, setExerciciosFiltrados] = useState([]);
  const [busca, setBusca] = useState('');
  const [showListasModal, setShowListasModal] = useState(false);
  const [listas, setListas] = useState([]);
  const [exercicioSelecionado, setExercicioSelecionado] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState(null);
  const [mensagemSucesso, setMensagemSucesso] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    carregarExercicios();
  }, []);

  useEffect(() => {
    if (busca) {
      const filtrados = exercicios.filter(ex => 
        ex.nome.toLowerCase().includes(busca.toLowerCase())
      );
      setExerciciosFiltrados(filtrados);
    } else {
      setExerciciosFiltrados(exercicios);
    }
  }, [busca, exercicios]);

  const carregarExercicios = async () => {
    const result = await exercicioService.getExercicios();
    if (result.success) {
      setExercicios(result.data);
      setExerciciosFiltrados(result.data);
    }
  };

  const filtrarPorMusculo = (musculo) => {
    if (musculo === '') {
      setExerciciosFiltrados(exercicios);
    } else {
      const filtrados = exercicios.filter(ex => ex.musculo === musculo);
      setExerciciosFiltrados(filtrados);
    }
  };

  const handleAddToList = async (exercicio) => {
    if (!user?.usuarioId) return;
    setExercicioSelecionado(exercicio);
    const result = await listaService.getListasUsuario(user.usuarioId);
    if (result.success) {
      setListas(result.data || []);
      setShowListasModal(true);
      if (!result.data?.length) {
        Swal.fire({
          color: 'white',
          background: '#1f2021',
          title: 'Nenhuma lista',
          text: 'Crie uma lista em Minhas Listas e volte aqui para adicionar exercícios.',
          icon: 'info'
        });
      }
    }
  };

  const adicionarExercicioNaLista = async (lista) => {
    if (!exercicioSelecionado) return;
    setLoadingAdd(lista.idlista);
    setMensagemSucesso(null);
    const result = await listaService.adicionarExercicioLista(
      lista.idlista,
      exercicioSelecionado.idexercicio
    );
    setLoadingAdd(null);

    if (result.success) {
      setMensagemSucesso(lista.nome);
      setTimeout(() => setMensagemSucesso(null), 3000);
    } else {
      Swal.fire({
        color: 'white',
        background: '#1f2021',
        title: 'Erro',
        text: result.message || 'Não foi possível adicionar. O exercício já pode estar na lista.',
        icon: 'error'
      });
    }
  };

  const fecharModalListas = () => {
    setShowListasModal(false);
    setExercicioSelecionado(null);
    setMensagemSucesso(null);
  };

  return (
    <div className="exercicios-page">
      <Sidebar />
      <div className="itens">
        <div className="filtros">
          <h2>Exercícios</h2>
          <input
            type="text"
            id="busca"
            placeholder="Buscar exercício..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <div className="botoes-filtro">
            <button id="todos" onClick={() => filtrarPorMusculo('')}>Todos</button>
            <button id="biceps" onClick={() => filtrarPorMusculo('Bíceps')}>Bíceps</button>
            <button id="triceps" onClick={() => filtrarPorMusculo('Tríceps')}>Tríceps</button>
            <button id="peito" onClick={() => filtrarPorMusculo('Peito')}>Peito</button>
            <button id="costas" onClick={() => filtrarPorMusculo('Costas')}>Costas</button>
            <button id="ombro" onClick={() => filtrarPorMusculo('Ombro')}>Ombro</button>
            <button id="quadriceps" onClick={() => filtrarPorMusculo('Quadríceps')}>Quadríceps</button>
          </div>
        </div>
        <div className="cards-sugestoes" id="card">
          {exerciciosFiltrados.map((exercicio) => (
            <ExercicioCard 
              key={exercicio.idexercicio} 
              exercicio={exercicio}
              onAddToList={handleAddToList}
              showAddButton={true}
            />
          ))}
        </div>
      </div>

      <Modal isOpen={showListasModal} onClose={fecharModalListas}>
        <h2>Adicionar à lista</h2>
        {mensagemSucesso && (
          <div className="feedback-sucesso" role="alert">
            <i className="bi bi-check-circle-fill"></i>
            <span>Adicionado a <strong>{mensagemSucesso}</strong>. Clique em outra lista para adicionar também.</span>
          </div>
        )}
        {exercicioSelecionado && (
          <p className="modal-exercicio-selecionado">
            <i className="bi bi-person-arms-up"></i>
            <strong>{exercicioSelecionado.nome}</strong>
            <span className="musculo-badge">{exercicioSelecionado.musculo}</span>
          </p>
        )}
        <p className="modal-dica-listas">Clique em uma lista para adicionar o exercício. Você pode adicionar em várias.</p>
        {listas.length === 0 ? (
          <div className="empty-listas-modal">
            <i className="bi bi-journal-plus"></i>
            <p>Você ainda não tem listas.</p>
            <span>Crie uma em <strong>Minhas Listas</strong> e volte aqui.</span>
          </div>
        ) : (
          <table className="exercise-table table-listas-modal">
            <thead>
              <tr>
                <th>Lista</th>
                <th>Tipo</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listas.map((lista) => (
                <tr
                  key={lista.idlista}
                  className={loadingAdd === lista.idlista ? 'loading-row' : ''}
                  onClick={() => loadingAdd !== lista.idlista && adicionarExercicioNaLista(lista)}
                >
                  <td>{lista.nome}</td>
                  <td><span className="badge-tipo">{lista.tipo}</span></td>
                  <td className="td-action">
                    {loadingAdd === lista.idlista ? (
                      <span className="spinner small"></span>
                    ) : (
                      <i className="bi bi-plus-circle"></i>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="modal-footer-actions">
          <button type="button" className="btn-secondary" onClick={fecharModalListas}>
            Fechar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Exercicios;
