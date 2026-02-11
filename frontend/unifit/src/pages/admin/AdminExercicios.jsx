import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import DataTable from '../../components/admin/DataTable';
import FilterBar from '../../components/admin/FilterBar';
import { Bar, Pie } from 'react-chartjs-2';
import { defaultChartOptions, pieChartOptions, CHART_COLORS, createBarGradient } from '../../utils/chartConfig';
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

  const musculoChartData = {
    labels: stats?.distribuicaoPorMusculo?.slice(0, 8)?.map((d) => d.musculo) || [],
    datasets: [
      {
        label: 'Total',
        data: stats?.distribuicaoPorMusculo?.slice(0, 8)?.map((d) => d.total) || [],
        backgroundColor: (ctx) => createBarGradient(ctx.chart),
        borderColor: 'rgba(220, 38, 38, 0.6)',
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(239, 68, 68, 0.95)',
      },
    ],
  };

  const dificuldadeChartData = {
    labels: stats?.distribuicaoPorDificuldade?.map((d) => d.dificuldade) || [],
    datasets: [
      {
        data: stats?.distribuicaoPorDificuldade?.map((d) => d.total) || [],
        backgroundColor: CHART_COLORS,
        borderColor: 'rgba(23, 23, 23, 0.9)',
        borderWidth: 2.5,
        hoverOffset: 12,
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
            <div style={{ height: 300 }}>
              <Bar data={musculoChartData} options={defaultChartOptions} />
            </div>
          </ChartCard>

          <ChartCard title="Distribuição por Dificuldade" subtitle="Níveis de dificuldade">
            <div style={{ height: 300 }}>
              <Pie data={dificuldadeChartData} options={pieChartOptions} />
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
