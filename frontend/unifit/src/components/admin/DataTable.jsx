import React, { useState } from 'react';

const DataTable = ({ 
  data = [], 
  columns = [],
  onRowClick,
  selectable = false,
  onSelectionChange,
  actions
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  // Selecionar/desselecionar todas as linhas
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = data.map((_, index) => index);
      setSelectedRows(allIds);
      onSelectionChange?.(allIds);
    } else {
      setSelectedRows([]);
      onSelectionChange?.([]);
    }
  };

  // Selecionar/desselecionar uma linha
  const handleSelectRow = (index) => {
    const newSelection = selectedRows.includes(index)
      ? selectedRows.filter(i => i !== index)
      : [...selectedRows, index];
    
    setSelectedRows(newSelection);
    onSelectionChange?.(newSelection);
  };

  // Ordenar dados
  const handleSort = (columnKey) => {
    const newDirection = sortColumn === columnKey && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(columnKey);
    setSortDirection(newDirection);
  };

  // Aplicar ordenação
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortColumn, sortDirection]);

  if (data.length === 0) {
    return (
      <div className="data-table__empty">
        <i className="bi bi-inbox"></i>
        <p>Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="data-table">
      {selectable && selectedRows.length > 0 && actions && (
        <div className="data-table__bulk-actions">
          <span className="data-table__bulk-count">
            {selectedRows.length} selecionado(s)
          </span>
          <div className="data-table__bulk-buttons">
            {actions}
          </div>
        </div>
      )}
      
      <div className="data-table__wrapper">
        <table className="data-table__table">
          <thead>
            <tr>
              {selectable && (
                <th className="data-table__th data-table__th--checkbox">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className={`data-table__th ${column.sortable ? 'data-table__th--sortable' : ''}`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="data-table__th-content">
                    {column.label}
                    {column.sortable && sortColumn === column.key && (
                      <i className={`bi bi-arrow-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={`data-table__tr ${selectedRows.includes(rowIndex) ? 'data-table__tr--selected' : ''}`}
                onClick={() => onRowClick?.(row, rowIndex)}
              >
                {selectable && (
                  <td className="data-table__td data-table__td--checkbox">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(rowIndex)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectRow(rowIndex);
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="data-table__td">
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
