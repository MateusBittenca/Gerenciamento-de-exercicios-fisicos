import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
import DataTable from '../../components/admin/DataTable';
import FilterBar from '../../components/admin/FilterBar';
import api from '../../services/api';
import Swal from 'sweetalert2';
import '../../styles/admin.css';

const AdminAdmins = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin');
      console.log('Response admins:', response.data);
      const adminsData = response.data.dados || [];
      setAdmins(adminsData);
      setFilteredAdmins(adminsData);
    } catch (error) {
      console.error('Erro ao carregar administradores:', error);
      Swal.fire('Erro', 'Não foi possível carregar os administradores', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let filtered = [...admins];

    if (filters.busca) {
      const busca = filters.busca.toLowerCase();
      filtered = filtered.filter(a =>
        a.Nome?.toLowerCase().includes(busca) ||
        a.Email?.toLowerCase().includes(busca) ||
        a.Cargo?.toLowerCase().includes(busca)
      );
    }

    setFilteredAdmins(filtered);
  };

  const handleResetFilter = () => {
    setFilteredAdmins(admins);
  };

  const handleDeleteAdmin = async (admin) => {
    const result = await Swal.fire({
      title: 'Excluir Administrador?',
      text: `Tem certeza que deseja excluir ${admin.Nome}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/${admin.AdministradorID}`);
        Swal.fire('Excluído!', 'Administrador excluído com sucesso', 'success');
        loadData();
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível excluir o administrador', 'error');
      }
    }
  };

  const handleCreateAdmin = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Novo Administrador',
      html: `
        <input id="swal-nome" class="swal2-input" placeholder="Nome">
        <input id="swal-email" class="swal2-input" placeholder="Email">
        <input id="swal-senha" type="password" class="swal2-input" placeholder="Senha">
        <input id="swal-cargo" class="swal2-input" placeholder="Cargo">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Criar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      preConfirm: () => {
        return {
          nome: document.getElementById('swal-nome').value,
          email: document.getElementById('swal-email').value,
          senha: document.getElementById('swal-senha').value,
          cargo: document.getElementById('swal-cargo').value
        };
      }
    });

    if (formValues) {
      if (!formValues.nome || !formValues.email || !formValues.senha) {
        Swal.fire('Erro', 'Preencha todos os campos obrigatórios', 'error');
        return;
      }

      try {
        await api.post('/admin/cadastrar', formValues);
        Swal.fire('Criado!', 'Administrador criado com sucesso', 'success');
        loadData();
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível criar o administrador', 'error');
      }
    }
  };

  const columns = [
    { key: 'Nome', label: 'Nome', sortable: true },
    { key: 'Email', label: 'Email', sortable: true },
    { key: 'Cargo', label: 'Cargo', sortable: true, render: (value) => value || '-' },
    {
      key: 'AdministradorID',
      label: 'Ações',
      render: (value, row) => (
        <button
          className="admin-btn admin-btn--small admin-btn--danger"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAdmin(row);
          }}
        >
          <i className="bi bi-trash"></i>
        </button>
      )
    }
  ];

  const filters = [
    {
      key: 'busca',
      label: 'Buscar',
      type: 'text',
      placeholder: 'Nome, email ou cargo...'
    }
  ];

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <div className="admin-loading">
            <div className="admin-loading__spinner"></div>
            <p className="admin-loading__text">Carregando administradores...</p>
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
            <h1 className="admin-header__title">Gerenciar Administradores</h1>
            <p className="admin-header__subtitle">Visualize e gerencie administradores da plataforma</p>
          </div>
          <button className="admin-btn admin-btn--primary" onClick={handleCreateAdmin}>
            <i className="bi bi-plus-lg"></i>
            Novo Administrador
          </button>
        </div>

        {/* Stat Cards */}
        <div className="admin-stats-grid">
          <StatCard
            title="Total de Administradores"
            value={admins.length}
            icon="shield-check"
            variant="danger"
          />
          <StatCard
            title="Com Cargo Definido"
            value={admins.filter(a => a.Cargo).length}
            icon="briefcase"
            variant="success"
          />
          <StatCard
            title="Sem Cargo"
            value={admins.filter(a => !a.Cargo).length}
            icon="dash-circle"
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
          data={filteredAdmins}
          columns={columns}
        />
      </main>
    </div>
  );
};

export default AdminAdmins;
