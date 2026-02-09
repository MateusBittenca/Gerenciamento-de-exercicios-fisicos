import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import ExercicioCard from '../components/ExercicioCard';
import { exercicioService } from '../services/exercicioService';
import { listaService } from '../services/listaService';
import { useAuth } from '../contexts/AuthContext';
import '../styles/home.css';

const Home = () => {
  const [exercicios, setExercicios] = useState([]);
  const [listasRecomendadas, setListasRecomendadas] = useState([]);
  const [minhasListas, setMinhasListas] = useState([]);
  const [stats, setStats] = useState({
    totalExercicios: 0,
    totalListas: 0,
    totalRecomendadas: 0
  });
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    carregarDados();
  }, [user?.usuarioId]);

  const carregarDados = async () => {
    setLoading(true);
    setErro(null);
    try {
      const exerciciosResult = await exercicioService.getExercicios();
      if (exerciciosResult.success) {
        const data = exerciciosResult.data || [];
        setExercicios(data);
        setStats(prev => ({ ...prev, totalExercicios: data.length }));
      }

      const listasRecomendadasResult = await listaService.getListasRecomendadas();
      if (listasRecomendadasResult.success) {
        const data = listasRecomendadasResult.data || [];
        setListasRecomendadas(data);
        setStats(prev => ({ ...prev, totalRecomendadas: data.length }));
      }

      if (user?.usuarioId) {
        const minhasListasResult = await listaService.getListasUsuario(user.usuarioId);
        if (minhasListasResult.success) {
          const data = minhasListasResult.data || [];
          setMinhasListas(data);
          setStats(prev => ({ ...prev, totalListas: data.length }));
        }
      }
    } catch (_) {
      setErro('Não foi possível carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <Sidebar />
      <div className="itens">
        {loading ? (
          <div className="home-loading">
            <span className="spinner" aria-hidden />
            <p>Carregando seu dashboard...</p>
          </div>
        ) : erro ? (
          <div className="home-erro">
            <i className="bi bi-exclamation-triangle" aria-hidden></i>
            <h3>Erro ao carregar</h3>
            <p>{erro}</p>
            <button type="button" className="btn-primary" onClick={carregarDados}>
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
        {/* Dashboard de Estatísticas */}
        <div className="stats-grid">
          <div className="stat-card" onClick={() => navigate('/exercicios')}>
            <div className="stat-icon">
              <i className="bi bi-heart-pulse"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalExercicios}</h3>
              <p>Exercícios Disponíveis</p>
            </div>
          </div>

          <div className="stat-card" onClick={() => navigate('/minhas-listas')}>
            <div className="stat-icon">
              <i className="bi bi-list-check"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalListas}</h3>
              <p>Minhas Listas</p>
            </div>
          </div>

          <div className="stat-card" onClick={() => navigate('/listas')}>
            <div className="stat-icon">
              <i className="bi bi-stars"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.totalRecomendadas}</h3>
              <p>Listas Recomendadas</p>
            </div>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Olá, {user?.nome || 'Usuário'}! 👋</h1>
          <p>Bem-vindo de volta. Continue seu progresso de hoje.</p>
        </div>

        <div className="sugestoes">
          <h2>Exercícios em Destaque</h2>
          <br />
          <div className="cards-sugestoes" id="card">
            {exercicios.slice(0, 4).map((exercicio) => (
              <ExercicioCard 
                key={exercicio.idexercicio} 
                exercicio={exercicio} 
              />
            ))}
          </div>
        </div>

        <div className="exerfav">
          <div id="cabeca" onClick={() => navigate('/listas')} style={{ cursor: 'pointer' }}>
            <h2>Listas Recomendadas</h2>
          </div>
          <br />
          <table id="tblListSugerida">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {listasRecomendadas.length === 0 ? (
                <tr>
                  <td colSpan="2">Nenhuma lista recomendada</td>
                </tr>
              ) : (
                listasRecomendadas.map((lista) => (
                  <tr key={lista.idlista}>
                    <td>{lista.nome}</td>
                    <td>{lista.tipo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="exerfav">
          <div id="cabeca2" onClick={() => navigate('/minhas-listas')} style={{ cursor: 'pointer' }}>
            <h2>Minhas Listas</h2>
          </div>
          <br />
          <table id="tblMinhasListas">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
              </tr>
            </thead>
            <tbody>
              {minhasListas.length === 0 ? (
                <tr>
                  <td colSpan="2">Nenhuma lista personalizada</td>
                </tr>
              ) : (
                minhasListas.map((lista) => (
                  <tr key={lista.idlista}>
                    <td>{lista.nome}</td>
                    <td>{lista.tipo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
