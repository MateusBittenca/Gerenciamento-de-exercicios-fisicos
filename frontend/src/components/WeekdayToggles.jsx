import { DIAS_UI } from '../api/client';

export default function WeekdayToggles({ value, onChange }) {
  const selecionados = value || [];

  function toggle(dia) {
    if (selecionados.includes(dia)) {
      onChange(selecionados.filter((item) => item !== dia));
    } else {
      onChange([...selecionados, dia].sort((a, b) => a - b));
    }
  }

  return (
    <div className="uf-dias">
      {DIAS_UI.map((dia) => (
        <button
          key={dia.value + dia.label}
          type="button"
          className={'uf-dia' + (selecionados.includes(dia.value) ? ' ativo' : '')}
          onClick={() => toggle(dia.value)}
        >
          {dia.label}
        </button>
      ))}
    </div>
  );
}
