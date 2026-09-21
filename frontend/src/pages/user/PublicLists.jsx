import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { groupListsById } from '../../api/client';
import ExerciseModal from '../../components/ExerciseModal';

export default function PublicLists() {
  const { request } = useAuth();
  const [listaExer, setListaExer] = useState([]);
  const [selecionado, setSelecionado] = useState(null);

  useEffect(() => {
    async function carregar() {
      const obj = await request('/listas/read', { method: 'get' });
      if (obj.status === true) {
        setListaExer(obj.dados || []);
      } else {
        alert('Login invalido!');
      }
    }
    carregar();
  }, [request]);

  const agrupadas = groupListsById(listaExer);

  return (
    <div>
      <div className="uf-page-head">
        <div>
          <h1>Listas oficiais</h1>
          <p>Treinos recomendados pela academia. Clique em um exercício para ver os detalhes.</p>
        </div>
      </div>

      {listaExer.length === 0 ? (
        <p className="uf-empty uf-card">Nenhuma lista encontrada!</p>
      ) : (
        <div className="uf-grid-lists" id="tabelaExercicios">
          {Object.keys(agrupadas).map((idLista) => {
            const lista = agrupadas[idLista];
            return (
              <article className="uf-card uf-list-card" key={idLista}>
                <h3>{lista[0].nome_lista}</h3>
                <ul>
                  {lista.map((exercicio) => (
                    <li key={exercicio.id_exercicio} onClick={() => setSelecionado(exercicio)}>
                      {exercicio.nome_exercicio}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      )}
      <ExerciseModal exercicio={selecionado} onClose={() => setSelecionado(null)} />
    </div>
  );
}
