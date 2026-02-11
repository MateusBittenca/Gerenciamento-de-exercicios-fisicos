import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import DataTable from '../../components/admin/DataTable';
import FilterBar from '../../components/admin/FilterBar';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

  const COLORS = ['#dc2626', '#3b82f6'];

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
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats?.distribuicaoPorSexo || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ Sexo, percent }) => `${Sexo} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                  nameKey="Sexo"
                >
                  {stats?.distribuicaoPorSexo?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#141414',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fafafa'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top 10 Usuários" subtitle="Usuários com mais listas criadas">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats?.topUsuarios || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="Nome" stroke="#a3a3a3" angle={-45} textAnchor="end" height={80} fontSize={11} />
                <YAxis stroke="#a3a3a3" />
                <Tooltip
                  contentStyle={{
                    background: '#141414',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fafafa'
                  }}
                />
                <Bar dataKey="total_listas" name="Listas" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
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
