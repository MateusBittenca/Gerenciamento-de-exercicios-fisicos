import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { swalDark } from '../../api/client';
import ExerciseCard from '../../components/ExerciseCard';
import ExerciseModal from '../../components/ExerciseModal';
import '../../css/home.css';
import '../../css/table.css';
import '../../css/modalExercicios.css';

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
        Swal.fire({
          ...swalDark,
          title: 'Sessão expirada!',
          text: 'Não foi possível carregar as listas recomendadas. Faça login novamente.',
          icon: 'error'
        });
      }

      const minhas = await request('/lista/' + payload.usuarioId, { method: 'get' });
      if (minhas.status === true) {
        setMinhasListas(minhas.dados || []);
      } else {
        Swal.fire({
          ...swalDark,
          title: 'Sessão expirada!',
          text: 'Não foi possível carregar suas listas. Faça login novamente.',
          icon: 'error'
        });
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
    <div className="itens pagina-home">
      <div className="sugestoes">
        <h2>Sugestões de exercicios</h2>
        <br />
        <div className="cards-sugestoes" id="card">
          {sugestoes.length === 0 ? (
            <p>Nenhum exercício encontrado.</p>
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
      </div>

      <div className="exerfav">
        <div id="cabeca" onClick={() => navigate('/app/listas')}>
          <h2>Listas Recomendadas</h2>
        </div>
        <br />
        <table id="tblListSugerida">
          <thead>
            <tr>
              <th>Nome</th>
              <th>tipo</th>
            </tr>
          </thead>
          <tbody>
            {listasSugeridas.length === 0 ? (
              <tr>
                <td colSpan="3">Nenhuma lista recomendada</td>
              </tr>
            ) : (
              listasSugeridas.map((lista) => (
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
        <div id="cabeca2" onClick={() => navigate('/app/minhas-listas')}>
          <h2>Minhas Listas</h2>
        </div>
        <br />
        <table id="tblMinhasListas">
          <thead>
            <tr>
              <th>Nome</th>
              <th>tipo</th>
            </tr>
          </thead>
          <tbody>
            {minhasListas.length === 0 ? (
              <tr>
                <td colSpan="3">Nenhuma lista personalizada</td>
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

      <ExerciseModal exercicio={selecionado} onClose={() => setSelecionado(null)} />
    </div>
  );
}
