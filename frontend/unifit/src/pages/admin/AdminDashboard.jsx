import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

  const COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'];

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
          {/* Crescimento de Usuários */}
          <ChartCard title="Crescimento de Usuários" subtitle="Novos usuários nos últimos 12 meses" className="chart-card--full">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.crescimentoUsuarios || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="mes" stroke="#a3a3a3" />
                <YAxis stroke="#a3a3a3" />
                <Tooltip
                  contentStyle={{
                    background: '#141414',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fafafa'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="novos" name="Novos Usuários" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Distribuição por Músculo */}
          <ChartCard title="Exercícios por Músculo" subtitle="Distribuição dos exercícios">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.distribuicaoPorMusculo || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ musculo, percent }) => `${musculo} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                  nameKey="musculo"
                >
                  {stats?.distribuicaoPorMusculo?.map((entry, index) => (
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

          {/* Exercícios Mais Usados */}
          <ChartCard title="Exercícios Mais Usados" subtitle="Top 10 exercícios em listas">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.exerciciosMaisUsados || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="nome" stroke="#a3a3a3" angle={-45} textAnchor="end" height={100} fontSize={12} />
                <YAxis stroke="#a3a3a3" />
                <Tooltip
                  contentStyle={{
                    background: '#141414',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: '#fafafa'
                  }}
                />
                <Bar dataKey="vezes_usado" name="Vezes Usado" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
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
