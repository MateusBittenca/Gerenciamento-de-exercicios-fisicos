import { useState } from 'react';
import { exerciseImageSrc, listaContemExercicio, OBJETIVOS } from '../api/client';

const ICONE_OBJETIVO = {
  hipertrofia: 'fitness_center',
  forca: 'bolt',
  adaptacao: 'directions_run',
  funcional: 'sports_gymnastics'
};

function labelObjetivo(valor) {
  return (OBJETIVOS.find((item) => item.value === valor) || {}).label || valor || 'Lista';
}

function textoQuantidade(quantidade) {
  if (!quantidade) {
    return 'Nenhum exercício cadastrado';
  }
  return quantidade === 1 ? '1 exercício cadastrado' : quantidade + ' exercícios cadastrados';
}

export default function AddToListModal({
  exercicio,
  listas,
  escolha,
  onEscolher,
  salvando,
  alunoNome,
  papel,
  buscaPlaceholder,
  criarLabel,
  onClose,
  onConfirm,
  onCreate
}) {
  const [busca, setBusca] = useState('');
  if (!exercicio) {
    return null;
  }

  const nome = exercicio.nome || exercicio.nome_exercicio;
  const musculo = exercicio.musculo || exercicio.musculo_trabalhado;
  const equipamento = exercicio.equipamento;
  const imagem = exerciseImageSrc(exercicio.imagem);
  const texto = busca.trim().toLowerCase();
  const visiveis = texto
    ? listas.filter((lista) => (lista.nome || '').toLowerCase().includes(texto))
    : listas;
  const idExercicio = exercicio.idexercicio || exercicio.id_exercicio;
  const listaEscolhida = listas.find((lista) => String(lista.id) === String(escolha));
  const selecionada = Boolean(listaEscolhida) && !listaContemExercicio(listaEscolhida, idExercicio);

  return (
    <div className="uf-modal" onClick={onClose}>
      <div
        className="uf-modal-card uf-addlist"
        role="dialog"
        aria-modal="true"
        aria-labelledby="addlist-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="uf-addlist-head">
          <div>
            <p className="uf-addlist-kicker">
              <span className="material-symbols-outlined">playlist_add</span>
              Gerenciador de Rotinas
            </p>
            <h2 id="addlist-title">Adicionar à Lista de Treino</h2>
          </div>
          <button type="button" className="uf-addlist-close" onClick={onClose} aria-label="Fechar">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        <div className="uf-addlist-ex">
          {imagem ? (
            <img src={imagem} alt="" />
          ) : (
            <span className="uf-addlist-ex-fallback material-symbols-outlined">fitness_center</span>
          )}
          <div className="uf-addlist-ex-main">
            <strong>{nome}</strong>
            <div className="uf-addlist-tags">
              {musculo ? <span>{musculo}</span> : null}
              {equipamento ? <em>{equipamento}</em> : null}
            </div>
          </div>
          {alunoNome ? (
            <div className="uf-addlist-pessoa">
              <small>{papel || 'Aluno'}</small>
              <strong>{alunoNome}</strong>
            </div>
          ) : null}
        </div>

        <div className="uf-addlist-search">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder={buscaPlaceholder || 'Buscar minhas listas de treino...'}
          />
        </div>

        <div className="uf-addlist-scroll" role="radiogroup" aria-label="Listas de treino">
          {listas.length === 0 ? (
            <p className="uf-addlist-vazio">Nenhuma lista ainda. Crie uma para incluir este exercício.</p>
          ) : visiveis.length === 0 ? (
            <p className="uf-addlist-vazio">Nenhuma lista com esse nome.</p>
          ) : visiveis.map((lista) => {
            const jaTem = listaContemExercicio(lista, idExercicio);
            const ativa = !jaTem && String(lista.id) === String(escolha);
            return (
              <button
                key={lista.id}
                type="button"
                role="radio"
                aria-checked={ativa}
                aria-disabled={jaTem}
                disabled={jaTem}
                className={'uf-addlist-item' + (ativa ? ' ativo' : '') + (jaTem ? ' ocupada' : '')}
                onClick={() => onEscolher(lista.id)}
              >
                <span className="uf-addlist-ico">
                  <span className="material-symbols-outlined">{ICONE_OBJETIVO[lista.objetivo] || 'fitness_center'}</span>
                </span>
                <span className="uf-addlist-item-main">
                  <span className="uf-addlist-item-title">
                    <strong>{lista.nome}</strong>
                    <em>{labelObjetivo(lista.objetivo)}</em>
                    {jaTem ? <em className="uf-addlist-ja">Já na lista</em> : null}
                  </span>
                  <span className="uf-addlist-item-sub">
                    {jaTem ? 'Este exercício já está nesta lista' : textoQuantidade(lista.quantidade)}
                  </span>
                </span>
                <span className="uf-addlist-status" aria-hidden="true">
                  <span className="material-symbols-outlined">{jaTem || ativa ? 'check' : 'add'}</span>
                </span>
              </button>
            );
          })}
        </div>

        {onCreate ? (
          <div className="uf-addlist-criar">
            <button type="button" onClick={onCreate}>
              <span className="material-symbols-outlined">add_circle</span>
              {criarLabel || 'Criar nova lista de treino personalizada'}
            </button>
          </div>
        ) : null}

        <footer className="uf-addlist-foot">
          <p>
            <span className="material-symbols-outlined">info</span>
            Você poderá ajustar cargas e repetições na lista.
          </p>
          <div>
            <button type="button" className="uf-addlist-cancel" onClick={onClose}>Cancelar</button>
            <button
              type="button"
              className="uf-btn-primary"
              disabled={!selecionada || salvando}
              onClick={onConfirm}
            >
              <span className="material-symbols-outlined">bookmark_add</span>
              {salvando ? 'Salvando...' : selecionada ? 'Salvar na Lista (1 selecionada)' : 'Salvar na Lista'}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
