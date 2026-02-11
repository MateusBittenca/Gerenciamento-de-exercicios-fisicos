import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ChartCard from '../../components/admin/ChartCard';
import { Bar, Pie } from 'react-chartjs-2';
import { defaultChartOptions, pieChartOptions, CHART_COLORS, createBarGradient } from '../../utils/chartConfig';
import { getUsersStats, getExerciciosStats, getDashboardStats } from '../../services/adminService';
import Swal from 'sweetalert2';
import '../../styles/admin.css';

const AdminRelatorios = () => {
  const [usuariosStats, setUsuariosStats] = useState(null);
  const [exerciciosStats, setExerciciosStats] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    try {
      setLoading(true);
      const [users, exercises, dashboard] = await Promise.all([
        getUsersStats(),
        getExerciciosStats(),
        getDashboardStats()
      ]);
      setUsuariosStats(users);
      setExerciciosStats(exercises);
      setDashboardStats(dashboard);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      Swal.fire('Erro', 'Não foi possível carregar as estatísticas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleExportSection = (sectionName) => {
    Swal.fire({
      title: 'Exportar Relatório',
      text: `A funcionalidade de exportar ${sectionName} será implementada em breve.`,
      icon: 'info'
    });
  };

  const distribuicaoSexoData = {
    labels: usuariosStats?.distribuicaoPorSexo?.map((d) => d.Sexo) || [],
    datasets: [
      {
        data: usuariosStats?.distribuicaoPorSexo?.map((d) => d.total) || [],
        backgroundColor: CHART_COLORS,
        borderColor: 'rgba(23, 23, 23, 0.9)',
        borderWidth: 2.5,
        hoverOffset: 12,
      },
    ],
  };

  const imcData = {
    labels: ['Abaixo do Peso', 'Peso Normal', 'Sobrepeso', 'Obesidade'],
    datasets: [
      {
        label: 'Usuários',
        data: [
          usuariosStats?.imcStats?.abaixo_peso || 0,
          usuariosStats?.imcStats?.peso_normal || 0,
          usuariosStats?.imcStats?.sobrepeso || 0,
          usuariosStats?.imcStats?.obesidade || 0,
        ],
        backgroundColor: (ctx) => createBarGradient(ctx.chart),
        borderColor: 'rgba(220, 38, 38, 0.6)',
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(239, 68, 68, 0.95)',
      },
    ],
  };

  const dificuldadeData = {
    labels: exerciciosStats?.distribuicaoPorDificuldade?.map((d) => d.dificuldade) || [],
    datasets: [
      {
        data: exerciciosStats?.distribuicaoPorDificuldade?.map((d) => d.total) || [],
        backgroundColor: CHART_COLORS,
        borderColor: 'rgba(23, 23, 23, 0.9)',
        borderWidth: 2.5,
        hoverOffset: 12,
      },
    ],
  };

  const exerciciosPopularesData = {
    labels: exerciciosStats?.exerciciosPopulares?.slice(0, 8)?.map((d) => d.nome) || [],
    datasets: [
      {
        label: 'Vezes Usado',
        data: exerciciosStats?.exerciciosPopulares?.slice(0, 8)?.map((d) => d.vezes_usado) || [],
        backgroundColor: (ctx) => createBarGradient(ctx.chart),
        borderColor: 'rgba(220, 38, 38, 0.6)',
        borderWidth: 1,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(239, 68, 68, 0.95)',
      },
    ],
  };

  const exerciciosMaisUsadosListasData = {
    labels: dashboardStats?.exerciciosMaisUsados?.map((d) => d.nome) || [],
    datasets: [
      {
        label: 'Vezes Usado',
        data: dashboardStats?.exerciciosMaisUsados?.map((d) => d.vezes_usado) || [],
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
            <p className="admin-loading__text">Carregando relatórios...</p>
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
          <h1 className="admin-header__title">Relatórios e Analytics</h1>
          <p className="admin-header__subtitle">Análises detalhadas do sistema Unifit</p>
        </div>

        {/* Seção de Usuários */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--gray-50)' }}>
              Relatório de Usuários
            </h2>
            <button
              className="admin-btn admin-btn--secondary"
              onClick={() => handleExportSection('Usuários')}
            >
              <i className="bi bi-file-earmark-pdf"></i>
              Exportar PDF
            </button>
          </div>

          <div className="admin-charts-grid">
            <ChartCard title="Distribuição por Sexo" subtitle="Total de usuários por gênero">
              <div style={{ height: 300 }}>
                <Pie data={distribuicaoSexoData} options={pieChartOptions} />
              </div>
            </ChartCard>

            <ChartCard title="Distribuição de IMC" subtitle="Usuários por categoria de IMC">
              <div style={{ height: 300 }}>
                <Bar data={imcData} options={defaultChartOptions} />
              </div>
            </ChartCard>
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginTop: '24px'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-50)', marginBottom: '16px' }}>
              Estatísticas Gerais
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginBottom: '4px' }}>Altura Média</p>
                <p style={{ color: 'var(--gray-50)', fontSize: '1.5rem', fontWeight: 600 }}>
                  {usuariosStats?.estatisticasCorpo?.altura_media?.toFixed(2)}m
                </p>
              </div>
              <div>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginBottom: '4px' }}>Peso Médio</p>
                <p style={{ color: 'var(--gray-50)', fontSize: '1.5rem', fontWeight: 600 }}>
                  {usuariosStats?.estatisticasCorpo?.peso_media?.toFixed(1)}kg
                </p>
              </div>
              <div>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginBottom: '4px' }}>IMC Médio</p>
                <p style={{ color: 'var(--gray-50)', fontSize: '1.5rem', fontWeight: 600 }}>
                  {usuariosStats?.imcStats?.imc_medio?.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Exercícios */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--gray-50)' }}>
              Relatório de Exercícios
            </h2>
            <button
              className="admin-btn admin-btn--secondary"
              onClick={() => handleExportSection('Exercícios')}
            >
              <i className="bi bi-file-earmark-pdf"></i>
              Exportar PDF
            </button>
          </div>

          <div className="admin-charts-grid">
            <ChartCard title="Exercícios por Dificuldade" subtitle="Distribuição por nível">
              <div style={{ height: 300 }}>
                <Pie data={dificuldadeData} options={pieChartOptions} />
              </div>
            </ChartCard>

            <ChartCard title="Exercícios Mais Populares" subtitle="Top 8 mais usados">
              <div style={{ height: 300 }}>
                <Bar data={exerciciosPopularesData} options={defaultChartOptions} />
              </div>
            </ChartCard>
          </div>

          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            marginTop: '24px'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--gray-50)', marginBottom: '16px' }}>
              Taxa de Utilização
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginBottom: '4px' }}>Total de Exercícios</p>
                <p style={{ color: 'var(--gray-50)', fontSize: '1.5rem', fontWeight: 600 }}>
                  {exerciciosStats?.taxaUtilizacao?.total_exercicios}
                </p>
              </div>
              <div>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginBottom: '4px' }}>Exercícios Usados</p>
                <p style={{ color: '#10b981', fontSize: '1.5rem', fontWeight: 600 }}>
                  {exerciciosStats?.taxaUtilizacao?.exercicios_usados}
                </p>
              </div>
              <div>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.875rem', marginBottom: '4px' }}>Nunca Usados</p>
                <p style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 600 }}>
                  {exerciciosStats?.taxaUtilizacao?.exercicios_nao_usados}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de Listas */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--gray-50)' }}>
              Relatório de Listas
            </h2>
            <button
              className="admin-btn admin-btn--secondary"
              onClick={() => handleExportSection('Listas')}
            >
              <i className="bi bi-file-earmark-pdf"></i>
              Exportar PDF
            </button>
          </div>

          <div className="admin-charts-grid">
            <ChartCard title="Exercícios Mais Usados em Listas" subtitle="Top 10">
              <div style={{ height: 300 }}>
                <Bar data={exerciciosMaisUsadosListasData} options={defaultChartOptions} />
              </div>
            </ChartCard>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminRelatorios;
