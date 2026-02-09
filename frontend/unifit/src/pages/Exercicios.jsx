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
  const [filtroMusculo, setFiltroMusculo] = useState('');
  const [filtroDificuldade, setFiltroDificuldade] = useState('');
  const [filtroEquipamento, setFiltroEquipamento] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    carregarExercicios();
  }, []);

  // Opções de filtro extraídas dos dados (ordenadas)
  const musculosDisponiveis = [...new Set(exercicios.map(ex => ex.musculo).filter(Boolean))].sort();
  const dificuldadesDisponiveis = [...new Set(exercicios.map(ex => ex.dificuldade).filter(Boolean))].sort();
  const equipamentosDisponiveis = [...new Set(exercicios.map(ex => ex.equipamento).filter(Boolean))].sort();

  useEffect(() => {
    let base = exercicios;
    if (filtroMusculo) {
      base = base.filter(ex => ex.musculo === filtroMusculo);
    }
    if (filtroDificuldade) {
      base = base.filter(ex => ex.dificuldade === filtroDificuldade);
    }
    if (filtroEquipamento) {
      base = base.filter(ex => ex.equipamento === filtroEquipamento);
    }
    if (busca.trim()) {
      const termo = busca.trim().toLowerCase();
      base = base.filter(ex =>
        (ex.nome && ex.nome.toLowerCase().includes(termo)) ||
        (ex.musculo && ex.musculo.toLowerCase().includes(termo)) ||
        (ex.equipamento && ex.equipamento.toLowerCase().includes(termo))
      );
    }
    setExerciciosFiltrados(base);
  }, [busca, exercicios, filtroMusculo, filtroDificuldade, filtroEquipamento]);

  const temFiltroAtivo = busca.trim() || filtroMusculo || filtroDificuldade || filtroEquipamento;

  const limparFiltros = () => {
    setBusca('');
    setFiltroMusculo('');
    setFiltroDificuldade('');
    setFiltroEquipamento('');
  };

  const carregarExercicios = async () => {
    setLoading(true);
    const result = await exercicioService.getExercicios();
    setLoading(false);
    if (result.success) {
      const data = result.data || [];
      setExercicios(data);
      setExerciciosFiltrados(data);
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
          <div className="filtros-header">
            <h2>Exercícios</h2>
            {!loading && (
              <div className="filtros-meta">
                <span className="filtros-contador">
                  {exerciciosFiltrados.length === exercicios.length
                    ? `${exercicios.length} exercício${exercicios.length !== 1 ? 's' : ''}`
                    : `${exerciciosFiltrados.length} de ${exercicios.length} exercícios`}
                </span>
                {temFiltroAtivo && (
                  <button
                    type="button"
                    className="btn-limpar-filtros"
                    onClick={limparFiltros}
                    title="Limpar todos os filtros"
                  >
                    <i className="bi bi-x-circle" aria-hidden />
                    Limpar filtros
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="filtros-busca-row">
            <label htmlFor="busca" className="sr-only">Buscar exercício</label>
            <input
              type="search"
              id="busca"
              placeholder="Buscar por nome, músculo ou equipamento..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              aria-describedby="busca-desc"
            />
            <span id="busca-desc" className="filtros-busca-dica">
              Busca em nome, músculo e equipamento
            </span>
          </div>

          <div className="filtros-grupos">
          <div className="filtros-grupo">
            <span className="filtros-label">Músculo</span>
            <div className="botoes-filtro">
              <button
                type="button"
                className={filtroMusculo === '' ? 'active' : ''}
                onClick={() => setFiltroMusculo('')}
              >
                Todos
              </button>
              {musculosDisponiveis.map((musculo) => (
                <button
                  type="button"
                  key={musculo}
                  className={filtroMusculo === musculo ? 'active' : ''}
                  onClick={() => setFiltroMusculo(musculo)}
                >
                  {musculo}
                </button>
              ))}
            </div>
          </div>

          <div className="filtros-grupo">
            <span className="filtros-label">Dificuldade</span>
            <div className="botoes-filtro">
              <button
                type="button"
                className={filtroDificuldade === '' ? 'active' : ''}
                onClick={() => setFiltroDificuldade('')}
              >
                Todas
              </button>
              {dificuldadesDisponiveis.map((d) => (
                <button
                  type="button"
                  key={d}
                  className={filtroDificuldade === d ? 'active' : ''}
                  onClick={() => setFiltroDificuldade(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="filtros-grupo filtros-equipamento">
            <label htmlFor="filtro-equipamento" className="filtros-label">Equipamento</label>
            <select
              id="filtro-equipamento"
              value={filtroEquipamento}
              onChange={(e) => setFiltroEquipamento(e.target.value)}
              aria-label="Filtrar por equipamento"
            >
              <option value="">Todos</option>
              {equipamentosDisponiveis.map((eq) => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>
          </div>
          </div>
        </div>
        {loading ? (
          <div className="exercicios-loading">
            <span className="spinner" aria-hidden />
            <p>Carregando exercícios...</p>
          </div>
        ) : exerciciosFiltrados.length === 0 ? (
          <div className="exercicios-empty">
            <i className="bi bi-search" aria-hidden />
            <h3>Nenhum exercício encontrado</h3>
            <p>
              {temFiltroAtivo
                ? 'Tente outros filtros ou limpe a busca para ver todos.'
                : 'Não há exercícios cadastrados no momento.'}
            </p>
            {temFiltroAtivo && (
              <button type="button" className="btn-primary" onClick={limparFiltros}>
                <i className="bi bi-x-circle" aria-hidden />
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
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
        )}
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
