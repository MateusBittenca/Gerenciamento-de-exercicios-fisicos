import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import { listaService } from '../services/listaService';
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import '../styles/lista.css';

const TIPOS_LISTA = ['Força', 'Cardio', 'Hipertrofia', 'Resistência', 'Flexibilidade', 'Outro'];

const MinhasListas = () => {
  const [listas, setListas] = useState([]);
  const [exerciciosLista, setExerciciosLista] = useState([]);
  const [showExerciciosModal, setShowExerciciosModal] = useState(false);
  const [showCriarModal, setShowCriarModal] = useState(false);
  const [listaSelecionada, setListaSelecionada] = useState(null);
  const [novaLista, setNovaLista] = useState({ nome: '', tipo: '' });
  const [loadingCriar, setLoadingCriar] = useState(false);
  const [loadingExercicios, setLoadingExercicios] = useState(false);
  const [removendoId, setRemovendoId] = useState(null);
  const [mensagemRemovido, setMensagemRemovido] = useState(false);
  const [confirmandoRemover, setConfirmandoRemover] = useState(null);
  const [mensagemErro, setMensagemErro] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    carregarListas();
  }, [user]);

  const carregarListas = async () => {
    if (user?.usuarioId) {
      const result = await listaService.getListasUsuario(user.usuarioId);
      if (result.success) {
        setListas(result.data);
      }
    }
  };

  const verExercicios = async (lista) => {
    setListaSelecionada(lista);
    setShowExerciciosModal(true);
    setLoadingExercicios(true);
    setExerciciosLista([]);
    const result = await listaService.getExerciciosLista(lista.idlista);
    setLoadingExercicios(false);
    if (result.success) {
      setExerciciosLista(result.data || []);
    } else {
      Swal.fire({
        color: 'white',
        background: '#1f2021',
        title: 'Erro',
        text: result.message || 'Não foi possível carregar os exercícios.',
        icon: 'error'
      });
    }
  };

  const criarLista = async (e) => {
    e.preventDefault();
    setLoadingCriar(true);
    const result = await listaService.criarLista({
      nome: novaLista.nome.trim(),
      tipo: novaLista.tipo,
      usuarioId: user.usuarioId
    });
    setLoadingCriar(false);

    if (result.success) {
      await Swal.fire({
        color: 'white',
        background: '#1f2021',
        title: 'Sucesso!',
        text: 'Lista criada com sucesso! Agora você pode adicionar exercícios em Exercícios.',
        icon: 'success'
      });
      setShowCriarModal(false);
      setNovaLista({ nome: '', tipo: '' });
      carregarListas();
    } else {
      Swal.fire({
        color: 'white',
        background: '#1f2021',
        title: 'Erro',
        text: result.message || 'Não foi possível criar a lista. Tente novamente.',
        icon: 'error'
      });
    }
  };

  const confirmarRemover = (idExercicio) => {
    setMensagemErro(null);
    setConfirmandoRemover(idExercicio);
  };

  const cancelarRemover = () => {
    setConfirmandoRemover(null);
    setMensagemErro(null);
  };

  const removerExercicio = async (idExercicio) => {
    setConfirmandoRemover(null);
    setMensagemErro(null);
    setRemovendoId(idExercicio);
    const removeResult = await listaService.removerExercicioLista(
      listaSelecionada.idlista,
      idExercicio
    );
    setRemovendoId(null);

    if (removeResult.success) {
      setExerciciosLista(prev => prev.filter(ex => ex.idexercicio !== idExercicio));
      setMensagemRemovido(true);
      setTimeout(() => setMensagemRemovido(false), 2500);
    } else {
      setMensagemErro(removeResult.message || 'Não foi possível remover. Tente novamente.');
      setTimeout(() => setMensagemErro(null), 5000);
    }
  };

  const deletarLista = async (lista) => {
    const result = await Swal.fire({
      color: "white",
      background: "#1f2021",
      title: "Confirmar",
      text: "Deseja deletar esta lista?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não"
    });

    if (result.isConfirmed) {
      const deleteResult = await listaService.deletarLista(lista.idlista);

      if (deleteResult.success) {
        await Swal.fire({
          color: "white",
          background: "#1f2021",
          title: "Sucesso!",
          text: "Lista deletada!",
          icon: "success"
        });
        carregarListas();
      }
    }
  };

  return (
    <div className="listas-page">
      <Sidebar />
      <div className="itens">
        <div className="page-header">
          <div>
            <h1>Minhas Listas</h1>
            <p>Crie e gerencie suas listas de treino personalizadas</p>
          </div>
          <button className="btn-primary" onClick={() => setShowCriarModal(true)}>
            <i className="bi bi-plus-lg"></i>
            Nova Lista
          </button>
        </div>

        {listas.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-journal-plus"></i>
            <h3>Nenhuma lista criada</h3>
            <p>Comece criando sua primeira lista de treino</p>
            <button className="btn-primary" onClick={() => setShowCriarModal(true)}>
              <i className="bi bi-plus-lg"></i>
              Criar Primeira Lista
            </button>
          </div>
        ) : (
          <div className="listas-grid">
            {listas.map((lista) => (
              <div key={lista.idlista} className="lista-card">
                <div className="lista-card-header">
                  <div className="lista-icon">
                    <i className="bi bi-list-stars"></i>
                  </div>
                  <span className="lista-badge">{lista.tipo}</span>
                </div>
                <div className="lista-card-body">
                  <h3>{lista.nome}</h3>
                  <p>Lista personalizada de treino</p>
                </div>
                <div className="lista-card-footer">
                  <button onClick={() => verExercicios(lista)}>
                    <i className="bi bi-eye"></i>
                    Ver Exercícios
                  </button>
                  <button className="btn-danger" onClick={() => deletarLista(lista)}>
                    <i className="bi bi-trash"></i>
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para criar lista */}
      <Modal isOpen={showCriarModal} onClose={() => !loadingCriar && setShowCriarModal(false)}>
        <h2>Nova Lista</h2>
        <p className="modal-dica">Dê um nome e escolha o tipo. Depois adicione exercícios em Exercícios.</p>
        <form onSubmit={criarLista} className="form-lista">
          <div className="form-group">
            <label htmlFor="nome">Nome da lista</label>
            <input
              type="text"
              id="nome"
              placeholder="Ex: Treino A, Segunda-feira..."
              value={novaLista.nome}
              onChange={(e) => setNovaLista({ ...novaLista, nome: e.target.value })}
              disabled={loadingCriar}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              value={novaLista.tipo}
              onChange={(e) => setNovaLista({ ...novaLista, tipo: e.target.value })}
              disabled={loadingCriar}
              required
            >
              <option value="">Selecione o tipo</option>
              {TIPOS_LISTA.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => setShowCriarModal(false)} disabled={loadingCriar}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loadingCriar}>
              {loadingCriar ? (
                <>
                  <span className="spinner"></span> Criando...
                </>
              ) : (
                <>Criar lista</>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal para ver exercícios */}
      <Modal isOpen={showExerciciosModal} onClose={() => { setShowExerciciosModal(false); setMensagemRemovido(false); setConfirmandoRemover(null); setMensagemErro(null); }}>
        <h2>{listaSelecionada?.nome}</h2>
        {mensagemRemovido && (
          <div className="feedback-sucesso" role="alert">
            <i className="bi bi-check-circle-fill"></i>
            <span>Exercício removido da lista.</span>
          </div>
        )}
        {mensagemErro && (
          <div className="feedback-erro" role="alert">
            <i className="bi bi-exclamation-circle-fill"></i>
            <span>{mensagemErro}</span>
          </div>
        )}
        <p className="modal-subtitulo">
          {listaSelecionada?.tipo && <span className="badge-tipo">{listaSelecionada.tipo}</span>}
          {exerciciosLista.length} exercício(s)
        </p>
        {loadingExercicios ? (
          <div className="loading-tabela">
            <span className="spinner"></span>
            <p>Carregando exercícios...</p>
          </div>
        ) : (
          <table className="exercise-table">
            <thead>
              <tr>
                <th>Exercício</th>
                <th>Músculo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {exerciciosLista.length === 0 ? (
                <tr>
                  <td colSpan="3">
                    <div className="empty-list-message">
                      <i className="bi bi-plus-circle"></i>
                      <p>Nenhum exercício nesta lista.</p>
                      <span>Vá em Exercícios e clique em &quot;Adicionar à lista&quot; nos cards.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                exerciciosLista.map((exercicio) => (
                  <tr key={exercicio.idexercicio}>
                    <td>{exercicio.nome}</td>
                    <td>{exercicio.musculo}</td>
                    <td>
                      {confirmandoRemover === exercicio.idexercicio ? (
                        <span className="confirmar-remover">
                          Remover?
                          <button type="button" className="btn-confirmar-sim" onClick={() => removerExercicio(exercicio.idexercicio)}>
                            Sim
                          </button>
                          <button type="button" className="btn-confirmar-nao" onClick={cancelarRemover}>
                            Não
                          </button>
                        </span>
                      ) : removendoId === exercicio.idexercicio ? (
                        <span className="loading-remover">
                          <span className="spinner small"></span>
                          Removendo...
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="btn-remover"
                          onClick={() => confirmarRemover(exercicio.idexercicio)}
                          title="Remover da lista"
                        >
                          <i className="bi bi-trash"></i>
                          Remover
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </Modal>
    </div>
  );
};

export default MinhasListas;
