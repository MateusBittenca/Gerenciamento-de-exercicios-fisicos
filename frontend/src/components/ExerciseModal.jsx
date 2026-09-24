import { classeDificuldade, exerciseImageSrc } from '../api/client';

export default function ExerciseModal({ exercicio, onClose, favorito, onFav }) {
  if (!exercicio) {
    return null;
  }

  const nome = exercicio.nome || exercicio.nome_exercicio;
  const musculo = exercicio.musculo || exercicio.musculo_trabalhado;
  const tipo = exercicio.tipo || exercicio.tipo_exercicio;
  const imagem = exercicio.imagem;
  const tom = classeDificuldade(exercicio.dificuldade);
  const chips = [
    musculo ? { texto: musculo } : null,
    exercicio.dificuldade ? { texto: exercicio.dificuldade, tom } : null,
    exercicio.equipamento ? { texto: exercicio.equipamento } : null
  ].filter(Boolean);
  const specs = [
    { label: 'Músculo', valor: musculo, icone: 'accessibility_new' },
    { label: 'Equipamento', valor: exercicio.equipamento, icone: 'fitness_center' },
    { label: 'Dificuldade', valor: exercicio.dificuldade, icone: 'signal_cellular_alt', tom },
    { label: 'Tipo', valor: tipo, icone: 'category' }
  ];

  return (
    <div className="uf-modal" onClick={onClose}>
      <div
        className="uf-modal-card uf-exdetail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="exdetail-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="uf-exdetail-top">
          <div className="uf-exdetail-chips">
            {chips.map((chip) => (
              <span key={chip.texto} className={chip.tom || undefined}>{chip.texto}</span>
            ))}
          </div>
          <div className="uf-exdetail-actions">
            {onFav && (
              <button type="button" className={'uf-fav' + (favorito ? ' ativo' : '')} onClick={() => onFav(exercicio)} aria-label="Favoritar">
                <span className="material-symbols-outlined" style={favorito ? { fontVariationSettings: "'FILL' 1" } : undefined}>favorite</span>
              </button>
            )}
            <button type="button" className="uf-exdetail-close" onClick={onClose} aria-label="Fechar">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <h2 id="exdetail-title">{nome}</h2>

        {imagem ? (
          <div className="uf-exdetail-media">
            <img src={exerciseImageSrc(imagem)} alt={nome} />
          </div>
        ) : null}

        <div className="uf-exdetail-specs">
          {specs.map((item) => (
            <div className={'uf-exdetail-spec' + (item.tom ? ' ' + item.tom : '')} key={item.label}>
              <small>
                <span className="material-symbols-outlined">{item.icone}</span>
                {item.label}
              </small>
              <strong>{item.valor || '—'}</strong>
            </div>
          ))}
        </div>

        {exercicio.instrucao ? (
          <section className="uf-exdetail-instr">
            <h3>Instruções</h3>
            <p>{exercicio.instrucao}</p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
