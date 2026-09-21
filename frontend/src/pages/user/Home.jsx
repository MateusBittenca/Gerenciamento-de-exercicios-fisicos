import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { exerciciosDaLista, groupListsById, listaProgramadaHoje, OBJETIVOS, swalDark } from '../../api/client';
import ExerciseCard from '../../components/ExerciseCard';
import ExerciseModal from '../../components/ExerciseModal';

export default function Home() {
  const { payload, request, refreshSessao } = useAuth();
  const navigate = useNavigate();
  const [exercicios, setExercicios] = useState([]);
  const [oficiais, setOficiais] = useState([]);
  const [minhas, setMinhas] = useState([]);
  const [favoritos, setFavoritos] = useState(0);
  const [treinosMes, setTreinosMes] = useState(0);
  const [selecionado, setSelecionado] = useState(null);

  useEffect(() => {
    async function carregar() {
      const listas = await request('/listas/read', { method: 'get' });
      if (listas.status === true) {
        setOficiais(listas.dados || []);
      }

      const minhasRes = await request('/lista/exercicios/' + payload.usuarioId, { method: 'get' });
      if (minhasRes.status === true) {
        setMinhas(minhasRes.dados || []);
      }

      const exer = await request('/exercicios', { method: 'get' });
      if (exer.status === true) {
        setExercicios(exer.dados || []);
      }

      const fav = await request('/exerfav', { method: 'get' });
      if (fav.status === true) {
        setFavoritos((fav.dados || []).length);
      }

      const resumo = await request('/treino/resumo', { method: 'get' });
      if (resumo.status === true) {
        setTreinosMes((resumo.dados && resumo.dados.concluidasMes) || 0);
      }
    }
    carregar();
  }, [payload.usuarioId, request]);

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

  const minhasAgrupadas = groupListsById(minhas);
  const oficiaisAgrupadas = groupListsById(oficiais);
  const sugestoes = exercicios.slice(0, 4);
  const labelObjetivo = (valor) => (OBJETIVOS.find((item) => item.value === valor) || {}).label || valor || 'Lista';
  const idsMinhas = Object.keys(minhasAgrupadas);

  return (
    <div>
      <div className="uf-page-head">
        <div>
          <p className="uf-kicker">Portal do aluno</p>
          <h1>Olá, {payload?.nome}</h1>
          <p>Continue de onde parou: listas oficiais, as suas e sugestões do catálogo.</p>
        </div>
      </div>

      <section className="uf-home-metrics">
        <article className="uf-card uf-metric">
          <span className="uf-muted">Treinos no mês</span>
          <strong>{treinosMes}</strong>
        </article>
        <article className="uf-card uf-metric">
          <span className="uf-muted">Listas ativas</span>
          <strong>{idsMinhas.length}</strong>
        </article>
        <article className="uf-card uf-metric">
          <span className="uf-muted">Favoritos</span>
          <strong>{favoritos}</strong>
        </article>
      </section>

      <div className="uf-home-grid">
        <section>
          <div className="uf-page-head">
            <h2>Minhas listas</h2>
          </div>
          {idsMinhas.length === 0 ? (
            <p className="uf-empty uf-card">Nenhuma lista personalizada</p>
          ) : (
            <div className="uf-grid-lists">
              {idsMinhas.map((idLista) => {
                const lista = minhasAgrupadas[idLista];
                const meta = lista[0];
                const itens = exerciciosDaLista(lista);
                const hoje = listaProgramadaHoje(meta);
                return (
                  <article className={'uf-card uf-list-card' + (hoje ? ' uf-hoje' : '')} key={idLista}>
                    {hoje && <span className="uf-chip ativo" style={{ cursor: 'default' }}>Programado hoje</span>}
                    <h3>{meta.nome_lista}</h3>
                    <p className="uf-muted">{labelObjetivo(meta.objetivo)} · Frequência {meta.tipo_lista}</p>
                    <ul>
                      {itens.length === 0 ? (
                        <li className="uf-muted">Nenhum exercício ainda</li>
                      ) : itens.slice(0, 4).map((exercicio) => (
                        <li key={exercicio.id_exercicio}>{exercicio.nome_exercicio}</li>
                      ))}
                    </ul>
                    <button type="button" className="uf-btn-primary" onClick={() => iniciar(meta.id_lista)} disabled={itens.length === 0}>
                      Iniciar Treino
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <div>
          <section className="uf-card uf-list-card" style={{ marginBottom: 20 }}>
            <div className="uf-page-head" style={{ marginBottom: 8 }}>
              <h3>Listas oficiais</h3>
            </div>
            {Object.keys(oficiaisAgrupadas).length === 0 ? (
              <p className="uf-muted">Nenhuma lista recomendada</p>
            ) : Object.keys(oficiaisAgrupadas).slice(0, 3).map((idLista) => {
              const lista = oficiaisAgrupadas[idLista];
              const meta = lista[0];
              const itens = exerciciosDaLista(lista);
              return (
                <div key={idLista} style={{ padding: '10px 0', borderBottom: '1px solid var(--uf-border)' }}>
                  <strong>{meta.nome_lista}</strong>
                  <p className="uf-muted">{labelObjetivo(meta.objetivo)} · {itens.length} exercícios</p>
                  <div className="uf-actions" style={{ marginTop: 8 }}>
                    <button type="button" className="uf-btn-outline" onClick={() => salvarOficial(meta.id_lista)}>Salvar Lista</button>
                    <button type="button" className="uf-btn-ghost" onClick={() => iniciar(meta.id_lista)} disabled={itens.length === 0}>Iniciar</button>
                  </div>
                </div>
              );
            })}
          </section>
        </div>
      </div>

      <section style={{ marginTop: 28 }}>
        <div className="uf-page-head">
          <h2>Sugestões do catálogo</h2>
        </div>
        <div className="uf-grid-cards">
          {sugestoes.length === 0 ? (
            <p className="uf-empty uf-card">Nenhum exercício encontrado.</p>
          ) : sugestoes.map((exercicio) => (
            <ExerciseCard
              key={exercicio.idexercicio}
              exercicio={exercicio}
              compact
              onOpen={() => setSelecionado(exercicio)}
            />
          ))}
        </div>
      </section>

      <ExerciseModal exercicio={selecionado} onClose={() => setSelecionado(null)} />
    </div>
  );
}
