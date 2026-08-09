import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import DataTable from '../../components/admin/DataTable';
import FilterBar from '../../components/admin/FilterBar';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getExerciciosStats, bulkDeleteExercicios } from '../../services/adminService';
import exercicioService from '../../services/exercicioService';
import Swal from 'sweetalert2';
import '../../styles/admin.css';

const AdminExercicios = () => {
  const [stats, setStats] = useState(null);
  const [exercicios, setExercicios] = useState([]);
  const [filteredExercicios, setFilteredExercicios] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, exerciciosData] = await Promise.all([
        getExerciciosStats(),
        exercicioService.getAll()
      ]);
      setStats(statsData);
      setExercicios(exerciciosData);
      setFilteredExercicios(exerciciosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Swal.fire('Erro', 'Não foi possível carregar os dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filters) => {
    let filtered = [...exercicios];

    if (filters.musculo) {
      filtered = filtered.filter(e => e.musculo === filters.musculo);
    }

    if (filters.dificuldade) {
      filtered = filtered.filter(e => e.dificuldade === filters.dificuldade);
    }

    if (filters.busca) {
      const busca = filters.busca.toLowerCase();
      filtered = filtered.filter(e =>
        e.nome?.toLowerCase().includes(busca)
      );
    }

    setFilteredExercicios(filtered);
  };

  const handleResetFilter = () => {
    setFilteredExercicios(exercicios);
  };

  const handleSelectionChange = (selection) => {
    const ids = selection.map(index => filteredExercicios[index].idexercicio);
    setSelectedIds(ids);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    const result = await Swal.fire({
      title: 'Excluir Exercícios?',
      text: `Tem certeza que deseja excluir ${selectedIds.length} exercício(s)?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await bulkDeleteExercicios(selectedIds);
        Swal.fire('Excluídos!', 'Exercícios excluídos com sucesso', 'success');
        setSelectedIds([]);
        loadData();
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível excluir os exercícios', 'error');
      }
    }
  };

  const handleDeleteOne = async (exercicio) => {
    const result = await Swal.fire({
      title: 'Excluir Exercício?',
      text: `Tem certeza que deseja excluir ${exercicio.nome}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await exercicioService.delete(exercicio.idexercicio);
        Swal.fire('Excluído!', 'Exercício excluído com sucesso', 'success');
        loadData();
      } catch (error) {
        Swal.fire('Erro', 'Não foi possível excluir o exercício', 'error');
      }
    }
  };

  const columns = [
    { key: 'nome', label: 'Nome', sortable: true },
    { key: 'musculo', label: 'Músculo', sortable: true },
    { key: 'equipamento', label: 'Equipamento', sortable: true },
    {
      key: 'dificuldade',
      label: 'Dificuldade',
      sortable: true,
      render: (value) => (
        <span style={{
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          background: value === 'Iniciante' ? 'rgba(16, 185, 129, 0.12)' :
                     value === 'Intermediário' ? 'rgba(245, 158, 11, 0.12)' :
                     'rgba(239, 68, 68, 0.12)',
          color: value === 'Iniciante' ? '#10b981' :
                 value === 'Intermediário' ? '#f59e0b' :
                 '#ef4444'
        }}>
          {value}
        </span>
      )
    },
    { key: 'tipo', label: 'Tipo', sortable: true },
    {
      key: 'idexercicio',
      label: 'Ações',
      render: (value, row) => (
        <button
          className="admin-btn admin-btn--small admin-btn--danger"
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteOne(row);
          }}
        >
          <i className="bi bi-trash"></i>
        </button>
      )
    }
  ];

  const filters = [
    {
      key: 'musculo',
      label: 'Músculo',
      type: 'select',
      options: [...new Set(exercicios.map(e => e.musculo))].filter(Boolean).map(m => ({ value: m, label: m }))
    },
    {
      key: 'dificuldade',
      label: 'Dificuldade',
      type: 'select',
      options: [
        { value: 'Iniciante', label: 'Iniciante' },
        { value: 'Intermediário', label: 'Intermediário' },
        { value: 'Avançado', label: 'Avançado' }
      ]
    },
    {
      key: 'busca',
      label: 'Buscar',
      type: 'text',
      placeholder: 'Nome do exercício...'
    }
  ];

  const COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'];

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar />
        <main className="admin-content">
          <div className="admin-loading">
            <div className="admin-loading__spinner"></div>
            <p className="admin-loading__text">Carregando exercícios...</p>
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
          <h1 className="admin-header__title">Gerenciar Exercícios</h1>
          <p className="admin-header__subtitle">Visualize e gerencie todos os exercícios da plataforma</p>
        </div>

        {/* Stat Cards */}
        <div className="admin-stats-grid">
          <StatCard
            title="Total de Exercícios"
            value={exercicios.length}
            icon="clipboard-heart"
            variant="success"
          />
          <StatCard
            title="Exercícios Usados"
            value={stats?.taxaUtilizacao?.exercicios_usados || 0}
            icon="check-circle"
            variant="info"
          />
          <StatCard
            title="Exercícios Não Usados"
            value={stats?.taxaUtilizacao?.exercicios_nao_usados || 0}
            icon="x-circle"
            variant="warning"
          />
          <StatCard
            title="Taxa de Utilização"
            value={stats?.taxaUtilizacao ? 
              `${((stats.taxaUtilizacao.exercicios_usados / stats.taxaUtilizacao.total_exercicios) * 100).toFixed(0)}%` 
              : '0%'}
            icon="graph-up"
            variant="danger"
          />
        </div>

        {/* Charts */}
        <div className="admin-charts-grid">
          <ChartCard title="Distribuição por Músculo" subtitle="Exercícios por grupo muscular">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.distribuicaoPorMusculo?.slice(0, 8) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="musculo" stroke="#a3a3a3" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis stroke="#a3a3a3" />
                <Tooltip
                  contentStyle={{
                    background: '#141414',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fafafa'
                  }}
                />
                <Bar dataKey="total" name="Total" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Distribuição por Dificuldade" subtitle="Níveis de dificuldade">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.distribuicaoPorDificuldade || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ dificuldade, percent }) => `${dificuldade} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                  nameKey="dificuldade"
                >
                  {stats?.distribuicaoPorDificuldade?.map((entry, index) => (
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
        </div>

        {/* Table */}
        <FilterBar
          filters={filters}
          onApply={handleFilter}
          onReset={handleResetFilter}
        />
        
        <DataTable
          data={filteredExercicios}
          columns={columns}
          selectable
          onSelectionChange={handleSelectionChange}
          actions={
            <button
              className="admin-btn admin-btn--small admin-btn--danger"
              onClick={handleBulkDelete}
              disabled={selectedIds.length === 0}
            >
              <i className="bi bi-trash"></i>
              Excluir Selecionados
            </button>
          }
        />
      </main>
    </div>
  );
};

export default AdminExercicios;
