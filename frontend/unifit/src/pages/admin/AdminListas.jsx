import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
import DataTable from '../../components/admin/DataTable';
import FilterBar from '../../components/admin/FilterBar';
import listaService from '../../services/listaService';
import Swal from 'sweetalert2';
import '../../styles/admin.css';

const AdminListas = () => {
  const [listas, setListas] = useState([]);
  const [filteredListas, setFilteredListas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [listasRecomendadasRes, listasUsuarios] = await Promise.all([
        listaService.getListasRecomendadas(),
        listaService.getAllListas()
      ]);
      const listasGlobais = listasRecomendadasRes?.success ? (listasRecomendadasRes.data || []) : [];
      const listasUsuariosArray = Array.isArray(listasUsuarios) ? listasUsuarios : [];
      const todas = [
        ...listasGlobais.map(l => ({ ...l, isGlobal: true })),
        ...listasUsuariosArray.filter(l => l.usuario_UsuarioID != null).map(l => ({ ...l, isGlobal: false }))
      ];
      
      setListas(todas);
      setFilteredListas(todas);
    } catch (error) {
      console.error('Erro ao carregar listas:', error);
      Swal.fire('Erro', 'Não foi possível carregar as listas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let filtered = [...listas];

    if (filters.tipo === 'global') {
      filtered = filtered.filter(l => l.isGlobal);
    } else if (filters.tipo === 'usuario') {
      filtered = filtered.filter(l => !l.isGlobal);
    }

    if (filters.busca) {
      const busca = filters.busca.toLowerCase();
      filtered = filtered.filter(l =>
        l.nome?.toLowerCase().includes(busca) ||
        l.tipo?.toLowerCase().includes(busca)
      );
    }

    setFilteredListas(filtered);
  };

  const handleResetFilter = () => {
    setFilteredListas(listas);
  };

  const handleDeleteLista = async (lista) => {
    const result = await Swal.fire({
      title: 'Excluir Lista?',
      text: `Tem certeza que deseja excluir a lista "${lista.nome}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await listaService.deleteLista(lista.idlista);
        Swal.fire('Excluída!', 'Lista excluída com sucesso', 'success');
        loadData();
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível excluir a lista', 'error');
      }
    }
  };

  const columns = [
    { key: 'nome', label: 'Nome', sortable: true },
    { key: 'tipo', label: 'Tipo', sortable: true },
    {
      key: 'isGlobal',
      label: 'Escopo',
      sortable: true,
      render: (value) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          background: value ? 'rgba(220, 38, 38, 0.12)' : 'rgba(59, 130, 246, 0.12)',
          color: value ? '#dc2626' : '#3b82f6'
        }}>
          {value ? 'Recomendada' : 'Usuário'}
        </span>
      )
    },
    {
      key: 'usuario_UsuarioID',
      label: 'ID Usuário',
      render: (value) => value || '-'
    },
    {
      key: 'idlista',
      label: 'Ações',
      render: (value, row) => (
        <button
          className="admin-btn admin-btn--small admin-btn--danger"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteLista(row);
          }}
        >
          <i className="bi bi-trash"></i>
        </button>
      )
    }
  ];

  const filters = [
    {
      key: 'tipo',
      label: 'Escopo',
      type: 'select',
      options: [
        { value: 'global', label: 'Recomendadas' },
        { value: 'usuario', label: 'De Usuários' }
      ]
    },
    {
      key: 'busca',
      label: 'Buscar',
      type: 'text',
      placeholder: 'Nome ou tipo...'
    }
  ];

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <div className="admin-loading">
            <div className="admin-loading__spinner"></div>
            <p className="admin-loading__text">Carregando listas...</p>
          </div>
        </main>
      </div>
    );
  }

  const listasGlobaisCount = listas.filter(l => l.isGlobal).length;
  const listasUsuariosCount = listas.filter(l => !l.isGlobal).length;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-header">
          <h1 className="admin-header__title">Gerenciar Listas</h1>
          <p className="admin-header__subtitle">Visualize e gerencie listas recomendadas e de usuários</p>
        </div>

        {/* Stat Cards */}
        <div className="admin-stats-grid">
          <StatCard
            title="Total de Listas"
            value={listas.length}
            icon="list-check"
            variant="info"
          />
          <StatCard
            title="Listas Recomendadas"
            value={listasGlobaisCount}
            icon="star"
            variant="danger"
          />
          <StatCard
            title="Listas de Usuários"
            value={listasUsuariosCount}
            icon="people"
            variant="success"
          />
          <StatCard
            title="Média por Usuário"
            value={listasUsuariosCount > 0 ? (listasUsuariosCount / new Set(listas.filter(l => !l.isGlobal).map(l => l.usuario_UsuarioID)).size).toFixed(1) : '0'}
            icon="graph-up"
            variant="warning"
          />
        </div>

        {/* Table */}
        <FilterBar
          filters={filters}
          onApply={handleFilter}
          onReset={handleResetFilter}
        />
        
        <DataTable
          data={filteredListas}
          columns={columns}
        />
      </main>
    </div>
  );
};

export default AdminListas;
