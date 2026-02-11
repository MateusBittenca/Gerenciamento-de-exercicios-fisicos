import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import DataTable from '../../components/admin/DataTable';
import FilterBar from '../../components/admin/FilterBar';
import { getLogs, exportLogs } from '../../services/logsService';
import Swal from 'sweetalert2';
import '../../styles/admin.css';

const AdminLogs = () => {
  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 100, total: 0, totalPages: 0 });
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, [pagination.page]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const data = await getLogs(filters, pagination.page, pagination.limit);
      setLogs(data.logs);
      setPagination(prev => ({ ...prev, ...data.pagination }));
    } catch (error) {
      console.error('Erro ao carregar logs:', error);
      Swal.fire('Erro', 'Não foi possível carregar os logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(() => loadLogs(), 100);
  };

  const handleResetFilter = () => {
    setFilters({});
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(() => loadLogs(), 100);
  };

  const handleExport = async () => {
    try {
      await exportLogs(filters);
      Swal.fire('Sucesso', 'Logs exportados com sucesso', 'success');
    } catch (error) {
      console.error('Erro ao exportar logs:', error);
      Swal.fire('Erro', 'Não foi possível exportar os logs', 'error');
    }
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const columns = [
    {
      key: 'created_at',
      label: 'Data/Hora',
      sortable: true,
      render: (value) => new Date(value).toLocaleString('pt-BR')
    },
    { key: 'usuario_nome', label: 'Usuário', sortable: true },
    {
      key: 'usuario_tipo',
      label: 'Tipo',
      sortable: true,
      render: (value) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          background: value === 'admin' ? 'rgba(220, 38, 38, 0.12)' : 'rgba(59, 130, 246, 0.12)',
          color: value === 'admin' ? '#dc2626' : '#3b82f6'
        }}>
          {value}
        </span>
      )
    },
    { key: 'acao', label: 'Ação', sortable: true },
    { key: 'detalhes', label: 'Detalhes' },
    { key: 'ip', label: 'IP' }
  ];

  const filterFields = [
    {
      key: 'usuarioTipo',
      label: 'Tipo de Usuário',
      type: 'select',
      options: [
        { value: 'usuario', label: 'Usuário' },
        { value: 'admin', label: 'Admin' }
      ]
    },
    {
      key: 'acao',
      label: 'Ação',
      type: 'text',
      placeholder: 'Ex: LOGIN, CRIAR_EXERCICIO...'
    },
    {
      key: 'usuarioNome',
      label: 'Nome do Usuário',
      type: 'text',
      placeholder: 'Nome...'
    },
    {
      key: 'startDate',
      label: 'Data Inicial',
      type: 'date'
    },
    {
      key: 'endDate',
      label: 'Data Final',
      type: 'date'
    }
  ];

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <div className="admin-loading">
            <div className="admin-loading__spinner"></div>
            <p className="admin-loading__text">Carregando logs...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="admin-header__title">Logs de Atividades</h1>
            <p className="admin-header__subtitle">Visualize todas as atividades do sistema</p>
          </div>
          <button className="admin-btn admin-btn--primary" onClick={handleExport}>
            <i className="bi bi-download"></i>
            Exportar CSV
          </button>
        </div>

        {/* Filter */}
        <FilterBar
          filters={filterFields}
          onApply={handleFilter}
          onReset={handleResetFilter}
        />

        {/* Table */}
        <DataTable
          data={logs}
          columns={columns}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '16px',
            marginTop: '24px',
            padding: '16px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              className="admin-btn admin-btn--secondary admin-btn--small"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
            >
              <i className="bi bi-chevron-left"></i>
              Anterior
            </button>
            <span style={{ color: 'var(--gray-300)' }}>
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <button
              className="admin-btn admin-btn--secondary admin-btn--small"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
            >
              Próxima
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminLogs;
