import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { groupListsById } from '../../api/client';
import ExerciseModal from '../../components/ExerciseModal';
import '../../css/lista.css';
import '../../css/modalExercicios.css';
import '../../css/exercicios.css';

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
    <div id="tabelaExercicios">
      {listaExer.length === 0 && (
        <tr>
          <td>Nenhuma lista encontrada!</td>
        </tr>
      )}
      {Object.keys(agrupadas).map((idLista) => {
        const lista = agrupadas[idLista];
        return (
          <div className="container-tabela" key={idLista}>
            <table>
              <thead>
                <tr>
                  <th onClick={() => alert('Você clicou no cabeçalho: ' + lista[0].nome_lista)}>
                    {lista[0].nome_lista}
                  </th>
                </tr>
              </thead>
              <tbody>
                {lista.map((exercicio) => (
                  <tr key={exercicio.id_exercicio} onClick={() => setSelecionado(exercicio)}>
                    <td>{exercicio.nome_exercicio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      <ExerciseModal exercicio={selecionado} onClose={() => setSelecionado(null)} />
    </div>
  );
}
