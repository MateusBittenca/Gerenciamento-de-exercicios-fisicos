export default function PrescriptionFields({ value, onChange }) {
  const form = value || {};

  function set(campo, dado) {
    onChange({ ...form, [campo]: dado });
  }

  return (
    <div className="uf-presc-grid">
      <div className="uf-field">
        <label>Séries</label>
        <input className="uf-input" type="number" min="1" value={form.series || ''} onChange={(e) => set('series', e.target.value)} />
      </div>
      <div className="uf-field">
        <label>Reps</label>
        <input className="uf-input" placeholder="8-10" value={form.reps || ''} onChange={(e) => set('reps', e.target.value)} />
      </div>
      <div className="uf-field">
        <label>Carga (kg)</label>
        <input className="uf-input" type="number" step="0.5" value={form.carga_kg || ''} onChange={(e) => set('carga_kg', e.target.value)} />
      </div>
      <div className="uf-field">
        <label>Descanso (s)</label>
        <input className="uf-input" type="number" min="0" value={form.descanso_seg || ''} onChange={(e) => set('descanso_seg', e.target.value)} />
      </div>
    </div>
  );
}
