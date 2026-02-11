import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import DataTable from '../../components/admin/DataTable';
import FilterBar from '../../components/admin/FilterBar';
import { Bar, Pie } from 'react-chartjs-2';
import { defaultChartOptions, pieChartOptions, CHART_COLORS, createBarGradient } from '../../utils/chartConfig';
import { getUsersStats } from '../../services/adminService';
import userService from '../../services/userService';
import Swal from 'sweetalert2';
import '../../styles/admin.css';

const AdminUsuarios = () => {
  const [stats, setStats] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, usuariosData] = await Promise.all([
        getUsersStats(),
        userService.getAllUsers()
      ]);
      setStats(statsData);
      setUsuarios(usuariosData);
      setFilteredUsuarios(usuariosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Swal.fire('Erro', 'Não foi possível carregar os dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let filtered = [...usuarios];

    if (filters.sexo) {
      filtered = filtered.filter(u => u.Sexo === filters.sexo);
    }

    if (filters.busca) {
      const busca = filters.busca.toLowerCase();
      filtered = filtered.filter(u =>
        u.Nome?.toLowerCase().includes(busca) ||
        u.Email?.toLowerCase().includes(busca)
      );
    }

    setFilteredUsuarios(filtered);
  };

  const handleResetFilter = () => {
    setFilteredUsuarios(usuarios);
  };

  const handleDeleteUser = async (usuario) => {
    const result = await Swal.fire({
      title: 'Excluir Usuário?',
      text: `Tem certeza que deseja excluir ${usuario.Nome}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await userService.deleteUser(usuario.UsuarioID);
        Swal.fire('Excluído!', 'Usuário excluído com sucesso', 'success');
        loadData();
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível excluir o usuário', 'error');
      }
    }
  };

  const columns = [
    { key: 'Nome', label: 'Nome', sortable: true },
    { key: 'Email', label: 'Email', sortable: true },
    {
      key: 'Sexo',
      label: 'Sexo',
      sortable: true,
      render: (value) => value || '-'
    },
    {
      key: 'Altura',
      label: 'Altura (m)',
      sortable: true,
      render: (value) => value ? value.toFixed(2) : '-'
    },
    {
      key: 'Peso',
      label: 'Peso (kg)',
      sortable: true,
      render: (value) => value ? value.toFixed(1) : '-'
    },
    {
      key: 'UsuarioID',
      label: 'Ações',
      render: (value, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="admin-btn admin-btn--small admin-btn--danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteUser(row);
            }}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      )
    }
  ];

  const filters = [
    {
      key: 'sexo',
      label: 'Sexo',
      type: 'select',
      options: [
        { value: 'Masculino', label: 'Masculino' },
        { value: 'Feminino', label: 'Feminino' }
      ]
    },
    {
      key: 'busca',
      label: 'Buscar',
      type: 'text',
      placeholder: 'Nome ou email...'
    }
  ];

  const sexoChartData = {
    labels: stats?.distribuicaoPorSexo?.map((d) => d.Sexo) || [],
    datasets: [
      {
        data: stats?.distribuicaoPorSexo?.map((d) => d.total) || [],
        backgroundColor: ['#dc2626', '#3b82f6'],
        borderColor: 'rgba(23, 23, 23, 0.9)',
        borderWidth: 2.5,
        hoverOffset: 12,
      },
    ],
  };

  const topUsuariosChartData = {
    labels: stats?.topUsuarios?.map((d) => d.Nome) || [],
    datasets: [
      {
        label: 'Listas',
        data: stats?.topUsuarios?.map((d) => d.total_listas) || [],
        backgroundColor: (ctx) => createBarGradient(ctx.chart),
        borderColor: 'rgba(220, 38, 38, 0.6)',
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(239, 68, 68, 0.95)',
      },
    ],
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <div className="admin-loading">
            <div className="admin-loading__spinner"></div>
            <p className="admin-loading__text">Carregando usuários...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <div className="admin-header">
          <h1 className="admin-header__title">Gerenciar Usuários</h1>
          <p className="admin-header__subtitle">Visualize e gerencie todos os usuários da plataforma</p>
        </div>

        {/* Stat Cards */}
        <div className="admin-stats-grid">
          <StatCard
            title="Total de Usuários"
            value={usuarios.length}
            icon="people"
            variant="info"
          />
          <StatCard
            title="IMC Médio"
            value={stats?.imcStats?.imc_medio ? stats.imcStats.imc_medio.toFixed(1) : '-'}
            icon="heart-pulse"
            variant="danger"
          />
          <StatCard
            title="Usuários com Listas"
            value={stats?.listasStats?.usuarios_com_listas || 0}
            icon="list-check"
            variant="success"
          />
          <StatCard
            title="Média de Listas/Usuário"
            value={stats?.listasStats?.media_listas ? stats.listasStats.media_listas.toFixed(1) : '-'}
            icon="graph-up"
            variant="warning"
          />
        </div>

        {/* Charts */}
        <div className="admin-charts-grid">
          <ChartCard title="Distribuição por Sexo" subtitle="Proporção de usuários">
            <div style={{ height: 250 }}>
              <Pie data={sexoChartData} options={pieChartOptions} />
            </div>
          </ChartCard>

          <ChartCard title="Top 10 Usuários" subtitle="Usuários com mais listas criadas">
            <div style={{ height: 250 }}>
              <Bar data={topUsuariosChartData} options={defaultChartOptions} />
            </div>
          </ChartCard>
        </div>

        {/* Table */}
        <FilterBar
          filters={filters}
          onApply={handleFilter}
          onReset={handleResetFilter}
        />
        
        <DataTable
          data={filteredUsuarios}
          columns={columns}
        />
      </main>
    </div>
  );
};

export default AdminUsuarios;
