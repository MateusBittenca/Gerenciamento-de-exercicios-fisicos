import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const FeedbackContext = createContext(null);

const ICONES = {
  ok: 'check_circle',
  erro: 'error',
  info: 'info'
};

export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialogo, setDialogo] = useState(null);
  const seq = useRef(0);

  const toast = useCallback((tipo, titulo, texto) => {
    const id = ++seq.current;
    const item = {
      id,
      tipo: tipo || 'info',
      titulo: texto ? titulo : '',
      texto: texto || titulo
    };
    setToasts((lista) => [...lista, item]);
    window.setTimeout(() => {
      setToasts((lista) => lista.filter((toastItem) => toastItem.id !== id));
    }, 3400);
  }, []);

  const confirmar = useCallback((opcoes) => {
    return new Promise((resolve) => {
      setDialogo({
        titulo: opcoes.titulo || 'Confirmar',
        texto: opcoes.texto || '',
        confirma: opcoes.confirma || 'Confirmar',
        cancela: opcoes.cancela || 'Cancelar',
        perigo: !!opcoes.perigo,
        resolver: resolve
      });
    });
  }, []);

  function fecharDialogo(valor) {
    if (dialogo && dialogo.resolver) {
      dialogo.resolver(valor);
    }
    setDialogo(null);
  }

  const value = useMemo(() => ({ toast, confirmar }), [toast, confirmar]);

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <div className="uf-toasts" aria-live="polite">
        {toasts.map((item) => (
          <div key={item.id} className={'uf-toast uf-toast-' + item.tipo}>
            <span className="material-symbols-outlined">{ICONES[item.tipo] || ICONES.info}</span>
            <div>
              {item.titulo ? <strong>{item.titulo}</strong> : null}
              <p>{item.texto}</p>
            </div>
          </div>
        ))}
      </div>
      {dialogo && (
        <div className="uf-modal" onClick={() => fecharDialogo(false)}>
          <div className="uf-modal-card uf-confirm" onClick={(e) => e.stopPropagation()}>
            <h2>{dialogo.titulo}</h2>
            {dialogo.texto ? <p className="uf-muted">{dialogo.texto}</p> : null}
            <div className="uf-actions" style={{ marginTop: 16, justifyContent: 'flex-end' }}>
              <button type="button" className="uf-btn-ghost" onClick={() => fecharDialogo(false)}>{dialogo.cancela}</button>
              <button
                type="button"
                className={dialogo.perigo ? 'uf-btn-danger' : 'uf-btn-primary'}
                onClick={() => fecharDialogo(true)}
              >
                {dialogo.confirma}
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback deve ser usado dentro de FeedbackProvider');
  }
  return context;
}
