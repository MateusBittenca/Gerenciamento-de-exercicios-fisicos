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
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    // Carregar exercícios
    const exerciciosResult = await exercicioService.getExercicios();
    if (exerciciosResult.success) {
      setExercicios(exerciciosResult.data);
      setStats(prev => ({ ...prev, totalExercicios: exerciciosResult.data.length }));
    }

    // Carregar listas recomendadas
    const listasRecomendadasResult = await listaService.getListasRecomendadas();
    if (listasRecomendadasResult.success) {
      setListasRecomendadas(listasRecomendadasResult.data);
      setStats(prev => ({ ...prev, totalRecomendadas: listasRecomendadasResult.data.length }));
    }

    // Carregar minhas listas
    if (user?.usuarioId) {
      const minhasListasResult = await listaService.getListasUsuario(user.usuarioId);
      if (minhasListasResult.success) {
        setMinhasListas(minhasListasResult.data);
        setStats(prev => ({ ...prev, totalListas: minhasListasResult.data.length }));
      }
    }
  };

  return (
    <div className="home-page">
      <Sidebar />
      <div className="itens">
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
      </div>
    </div>
  );
};

export default Home;
