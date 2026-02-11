import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { defaultChartOptions, lineChartOptions, pieChartOptions, CHART_COLORS, createLineGradient, createBarGradient } from '../../utils/chartConfig';
import { getDashboardStats } from '../../services/adminService';
import '../../styles/admin.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const crescimentoUsuariosData = {
    labels: stats?.crescimentoUsuarios?.map((d) => d.mes) || [],
    datasets: [
      {
        label: 'Novos Usuários',
        data: stats?.crescimentoUsuarios?.map((d) => d.novos) || [],
        borderColor: '#dc2626',
        backgroundColor: (ctx) => createLineGradient(ctx.chart),
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#dc2626',
        pointBorderColor: 'rgba(255,255,255,0.9)',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: '#ef4444',
        pointHoverBorderColor: '#fff',
      },
    ],
  };

  const exerciciosPorMusculoData = {
    labels: stats?.distribuicaoPorMusculo?.map((d) => d.musculo) || [],
    datasets: [
      {
        data: stats?.distribuicaoPorMusculo?.map((d) => d.total) || [],
        backgroundColor: CHART_COLORS,
        borderColor: 'rgba(23, 23, 23, 0.9)',
        borderWidth: 2.5,
        hoverOffset: 12,
        hoverBorderWidth: 2,
      },
    ],
  };

  const exerciciosMaisUsadosData = {
    labels: stats?.exerciciosMaisUsados?.map((d) => d.nome) || [],
    datasets: [
      {
        label: 'Vezes Usado',
        data: stats?.exerciciosMaisUsados?.map((d) => d.vezes_usado) || [],
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
            <p className="admin-loading__text">Carregando dashboard...</p>
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
          <h1 className="admin-header__title">Dashboard</h1>
          <p className="admin-header__subtitle">Visão geral do sistema Unifit</p>
        </div>

        {/* Stat Cards */}
        <div className="admin-stats-grid">
          <StatCard
            title="Total de Usuários"
            value={stats?.totais?.usuarios || 0}
            icon="people"
            variant="info"
          />
          <StatCard
            title="Total de Exercícios"
            value={stats?.totais?.exercicios || 0}
            icon="clipboard-heart"
            variant="success"
          />
          <StatCard
            title="Total de Listas"
            value={stats?.totais?.listas || 0}
            icon="list-check"
            variant="warning"
          />
          <StatCard
            title="Administradores"
            value={stats?.totais?.admins || 0}
            icon="shield-check"
            variant="danger"
          />
        </div>

        {/* Charts */}
        <div className="admin-charts-grid">
          <ChartCard title="Crescimento de Usuários" subtitle="Novos usuários nos últimos 12 meses" className="chart-card--full">
            <div style={{ height: 300 }}>
              <Line data={crescimentoUsuariosData} options={lineChartOptions} />
            </div>
          </ChartCard>

          <ChartCard title="Exercícios por Músculo" subtitle="Distribuição dos exercícios">
            <div style={{ height: 300 }}>
              <Pie data={exerciciosPorMusculoData} options={pieChartOptions} />
            </div>
          </ChartCard>

          <ChartCard title="Exercícios Mais Usados" subtitle="Top 10 exercícios em listas">
            <div style={{ height: 300 }}>
              <Bar data={exerciciosMaisUsadosData} options={defaultChartOptions} />
            </div>
          </ChartCard>
        </div>

        {/* Atividades Recentes */}
        <ChartCard title="Atividades Recentes" subtitle="Últimas ações no sistema">
          <div className="data-table__wrapper" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table className="data-table__table">
              <thead>
                <tr>
                  <th className="data-table__th">Data/Hora</th>
                  <th className="data-table__th">Usuário</th>
                  <th className="data-table__th">Tipo</th>
                  <th className="data-table__th">Ação</th>
                  <th className="data-table__th">Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {stats?.atividadesRecentes?.map((atividade, index) => (
                  <tr key={index} className="data-table__tr">
                    <td className="data-table__td">
                      {new Date(atividade.created_at).toLocaleString('pt-BR')}
                    </td>
                    <td className="data-table__td">{atividade.usuario_nome}</td>
                    <td className="data-table__td">
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        background: atividade.usuario_tipo === 'admin' ? 'rgba(220, 38, 38, 0.12)' : 'rgba(59, 130, 246, 0.12)',
                        color: atividade.usuario_tipo === 'admin' ? '#dc2626' : '#3b82f6'
                      }}>
                        {atividade.usuario_tipo}
                      </span>
                    </td>
                    <td className="data-table__td">{atividade.acao}</td>
                    <td className="data-table__td">{atividade.detalhes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </main>
    </div>
  );
};

export default AdminDashboard;
