import React, { useState } from 'react';

const FilterBar = ({ 
  filters = [],
  onApply,
  onReset
}) => {
  const [filterValues, setFilterValues] = useState({});

  const handleChange = (key, value) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onApply?.(filterValues);
  };

  const handleReset = () => {
    setFilterValues({});
    onReset?.();
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar__inputs">
        {filters.map((filter) => (
          <div key={filter.key} className="filter-bar__field">
            <label className="filter-bar__label">{filter.label}</label>
            {filter.type === 'select' ? (
              <select
                className="filter-bar__select"
                value={filterValues[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
              >
                <option value="">Todos</option>
                {filter.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : filter.type === 'date' ? (
              <input
                type="date"
                className="filter-bar__input"
                value={filterValues[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
              />
            ) : (
              <input
                type="text"
                className="filter-bar__input"
                placeholder={filter.placeholder}
                value={filterValues[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="filter-bar__actions">
        <button className="filter-bar__button filter-bar__button--reset" onClick={handleReset}>
          <i className="bi bi-arrow-counterclockwise"></i>
          Limpar
        </button>
        <button className="filter-bar__button filter-bar__button--apply" onClick={handleApply}>
          <i className="bi bi-funnel"></i>
          Aplicar
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
