import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { exerciciosDaLista, formatPrescricao, groupListsById, OBJETIVOS, swalDark } from '../../api/client';
import ExerciseModal from '../../components/ExerciseModal';

export default function PublicLists() {
  const { request, refreshSessao } = useAuth();
  const navigate = useNavigate();
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

  async function salvarOficial(idLista) {
    const obj = await request('/lista/salvar-oficial', {
      method: 'post',
      body: JSON.stringify({ idLista })
    });
    if (obj.status === true) {
      Swal.fire({ ...swalDark, title: 'Salva!', text: 'Lista adicionada à sua rotina.', icon: 'success' });
      navigate('/app/minhas-listas');
    } else {
      Swal.fire({ ...swalDark, title: 'Atenção', text: obj.msg || 'Não foi possível salvar.', icon: 'info' });
    }
  }

  async function iniciar(idLista) {
    const obj = await request('/treino/iniciar', {
      method: 'post',
      body: JSON.stringify({ idLista })
    });
    if (obj.status === true && obj.dados && obj.dados.sessao) {
      await refreshSessao();
      navigate('/app/treino/' + obj.dados.sessao.id);
    } else {
      Swal.fire({ ...swalDark, title: 'Erro!', text: obj.msg || 'Não foi possível iniciar.', icon: 'error' });
    }
  }

  const agrupadas = groupListsById(listaExer);
  const labelObjetivo = (valor) => (OBJETIVOS.find((item) => item.value === valor) || {}).label || valor || 'Oficial';

  return (
    <div>
      <div className="uf-page-head">
        <div>
          <h1>Listas oficiais</h1>
          <p>Treinos recomendados pela academia. Salve na sua rotina ou execute direto.</p>
        </div>
      </div>

      {Object.keys(agrupadas).length === 0 ? (
        <p className="uf-empty uf-card">Nenhuma lista encontrada!</p>
      ) : (
        <div className="uf-grid-lists" id="tabelaExercicios">
          {Object.keys(agrupadas).map((idLista) => {
            const lista = agrupadas[idLista];
            const meta = lista[0];
            const itens = exerciciosDaLista(lista);
            return (
              <article className="uf-card uf-list-card" key={idLista}>
                <div className="uf-chips" style={{ marginBottom: 8 }}>
                  <span className="uf-chip" style={{ cursor: 'default' }}>{labelObjetivo(meta.objetivo)}</span>
                  <span className="uf-chip" style={{ cursor: 'default' }}>Frequência {meta.tipo_lista}</span>
                </div>
                <h3>{meta.nome_lista}</h3>
                <ul>
                  {itens.length === 0 ? (
                    <li className="uf-muted">Nenhum exercício ainda</li>
                  ) : itens.map((exercicio) => (
                    <li key={exercicio.id_exercicio} onClick={() => setSelecionado(exercicio)}>
                      {exercicio.nome_exercicio}
                      <small className="uf-muted"> · {formatPrescricao(exercicio)}</small>
                    </li>
                  ))}
                </ul>
                <div className="uf-actions" style={{ marginTop: 12 }}>
                  <button type="button" className="uf-btn-outline" onClick={() => salvarOficial(meta.id_lista)}>
                    <span className="material-symbols-outlined">bookmark_add</span>
                    Salvar Lista
                  </button>
                  <button type="button" className="uf-btn-primary" onClick={() => iniciar(meta.id_lista)} disabled={itens.length === 0}>
                    Iniciar Treino
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <ExerciseModal exercicio={selecionado} onClose={() => setSelecionado(null)} />
    </div>
  );
}
