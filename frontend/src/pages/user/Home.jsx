import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import ExerciseCard from '../../components/ExerciseCard';
import ExerciseModal from '../../components/ExerciseModal';

export default function Home() {
  const { payload, request } = useAuth();
  const navigate = useNavigate();
  const [exercicios, setExercicios] = useState([]);
  const [listasSugeridas, setListasSugeridas] = useState([]);
  const [minhasListas, setMinhasListas] = useState([]);
  const [selecionado, setSelecionado] = useState(null);

  useEffect(() => {
    async function carregar() {
      const listas = await request('/lista', { method: 'get' });
      if (listas.status === true) {
        setListasSugeridas(listas.dados || []);
      } else {
        alert('Login invalido!');
      }

      const minhas = await request('/lista/' + payload.usuarioId, { method: 'get' });
      if (minhas.status === true) {
        setMinhasListas(minhas.dados || []);
      } else {
        alert('Login invalido!');
      }

      const exer = await request('/exercicios', { method: 'get' });
      if (exer.status === true) {
        setExercicios(exer.dados || []);
      }
    }
    carregar();
  }, [payload.usuarioId, request]);

  const sugestoes = exercicios.slice(0, 2);

  return (
    <div>
      <div className="uf-page-head">
        <div>
          <p className="uf-kicker">Portal do aluno</p>
          <h1>Olá, {payload?.nome}</h1>
          <p>Continue de onde parou: listas oficiais, as suas e sugestões do catálogo.</p>
        </div>
        <div className="uf-stat">
          {listasSugeridas.length} oficiais · {minhasListas.length} minhas
        </div>
      </div>

      <div className="uf-home-grid">
        <section>
          <div className="uf-page-head">
            <h2>Sugestões de exercícios</h2>
          </div>
          <div className="uf-grid-cards">
            {sugestoes.length === 0 ? (
              <p className="uf-empty uf-card">Nenhum exercício encontrado.</p>
            ) : (
              sugestoes.map((exercicio) => (
                <ExerciseCard
                  key={exercicio.idexercicio}
                  exercicio={exercicio}
                  compact
                  onOpen={() => setSelecionado(exercicio)}
                />
              ))
            )}
          </div>
        </section>

        <div>
          <section className="uf-card uf-list-card" style={{ marginBottom: 20, cursor: 'pointer' }} onClick={() => navigate('/app/listas')}>
            <h3>Listas recomendadas</h3>
            {listasSugeridas.length === 0 ? (
              <p className="uf-muted">Nenhuma lista recomendada</p>
            ) : (
              <ul>
                {listasSugeridas.map((lista) => (
                  <li key={lista.idlista}>
                    <strong>{lista.nome}</strong>
                    <span className="uf-muted"> · {lista.tipo}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="uf-card uf-list-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/app/minhas-listas')}>
            <h3>Minhas listas</h3>
            {minhasListas.length === 0 ? (
              <p className="uf-muted">Nenhuma lista personalizada</p>
            ) : (
              <ul>
                {minhasListas.map((lista) => (
                  <li key={lista.idlista}>
                    <strong>{lista.nome}</strong>
                    <span className="uf-muted"> · {lista.tipo}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <ExerciseModal exercicio={selecionado} onClose={() => setSelecionado(null)} />
    </div>
  );
}
