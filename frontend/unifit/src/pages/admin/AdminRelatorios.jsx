import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import ChartCard from '../../components/admin/ChartCard';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  const COLORS = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'];

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
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={usuariosStats?.distribuicaoPorSexo || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ Sexo, percent }) => `${Sexo} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="total"
                    nameKey="Sexo"
                  >
                    {usuariosStats?.distribuicaoPorSexo?.map((entry, index) => (
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

            <ChartCard title="Distribuição de IMC" subtitle="Usuários por categoria de IMC">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    { categoria: 'Abaixo do Peso', total: usuariosStats?.imcStats?.abaixo_peso || 0 },
                    { categoria: 'Peso Normal', total: usuariosStats?.imcStats?.peso_normal || 0 },
                    { categoria: 'Sobrepeso', total: usuariosStats?.imcStats?.sobrepeso || 0 },
                    { categoria: 'Obesidade', total: usuariosStats?.imcStats?.obesidade || 0 }
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="categoria" stroke="#a3a3a3" angle={-15} textAnchor="end" height={80} />
                  <YAxis stroke="#a3a3a3" />
                  <Tooltip
                    contentStyle={{
                      background: '#141414',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '10px',
                      color: '#fafafa'
                    }}
                  />
                  <Bar dataKey="total" name="Usuários" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={exerciciosStats?.distribuicaoPorDificuldade || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ dificuldade, percent }) => `${dificuldade} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="total"
                    nameKey="dificuldade"
                  >
                    {exerciciosStats?.distribuicaoPorDificuldade?.map((entry, index) => (
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

            <ChartCard title="Exercícios Mais Populares" subtitle="Top 8 mais usados">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={exerciciosStats?.exerciciosPopulares?.slice(0, 8) || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="nome"
                    stroke="#a3a3a3"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    fontSize={11}
                  />
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dashboardStats?.exerciciosMaisUsados || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis
                    dataKey="nome"
                    stroke="#a3a3a3"
                    angle={-45}
                    textAnchor="end"
                    height={120}
                    fontSize={11}
                  />
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
        </div>
      </main>
    </div>
  );
};

export default AdminRelatorios;
