import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { listaService } from '../services/listaService';
import { userService } from '../services/userService';
import Swal from 'sweetalert2';
import '../styles/usuario.css';

const formatPeso = (v) => (v != null && v !== '' ? `${Number(v)} kg` : '—');
const formatAltura = (v) => (v != null && v !== '' ? `${Number(v)} m` : '—');
const formatSexo = (v) => {
  if (v == null || v === '') return '—';
  const s = String(v).toLowerCase();
  if (s === 'm' || s === 'masculino') return 'Masculino';
  if (s === 'f' || s === 'feminino') return 'Feminino';
  return v;
};

const Usuario = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const [stats, setStats] = useState({ totalListas: 0 });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    email: '',
    peso: '',
    altura: '',
    sexo: ''
  });

  useEffect(() => {
    if (user) {
      setForm({
        nome: user.nome || '',
        email: user.email || '',
        peso: user.peso != null ? user.peso : '',
        altura: user.altura != null ? user.altura : '',
        sexo: user.sexo || ''
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.usuarioId) carregarEstatisticas();
  }, [user]);

  const carregarEstatisticas = async () => {
    if (!user?.usuarioId) return;
    const listasResult = await listaService.getListasUsuario(user.usuarioId);
    if (listasResult.success) {
      setStats((prev) => ({ ...prev, totalListas: listasResult.data.length }));
    }
  };

  const handleSave = async () => {
    if (!user?.usuarioId) return;
    setSaving(true);
    const result = await userService.updateUsuario(user.usuarioId, {
      nome: form.nome,
      email: form.email,
      sexo: form.sexo || null,
      altura: form.altura === '' ? null : Number(form.altura),
      peso: form.peso === '' ? null : Number(form.peso)
    });
    setSaving(false);
    if (result.success) {
      updateUser(result.data);
      setEditing(false);
      Swal.fire({ icon: 'success', title: 'Perfil atualizado', timer: 2000, showConfirmButton: false });
    } else {
      Swal.fire({ icon: 'error', title: result.message || 'Erro ao salvar' });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="usuario-page">
      <Sidebar />
      <div className="itens">
        <header className="ficha-page-header">
          <h1>Ficha do usuário</h1>
          <p>Dados pessoais e físicos para acompanhamento</p>
        </header>

        <div className="ficha-layout">
          <section className="ficha-card" aria-label="Ficha técnica">
            <div className="ficha-card-head">
              <h2>Ficha técnica</h2>
              {!editing ? (
                <button type="button" className="btn-editar" onClick={() => setEditing(true)}>
                  <i className="bi bi-pencil" aria-hidden></i>
                  Editar
                </button>
              ) : (
                <div className="ficha-actions">
                  <button type="button" className="btn-cancelar" onClick={() => setEditing(false)}>
                    Cancelar
                  </button>
                  <button type="button" className="btn-salvar" onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <span className="spinner small" aria-hidden></span>
                        Salvando…
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg" aria-hidden></i>
                        Salvar
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="ficha-body">
              <div className="ficha-section">
                <h3>Identificação</h3>
                <dl className="ficha-lista">
                  <div className="ficha-row">
                    <dt>Nome completo</dt>
                    <dd>
                      {editing ? (
                        <input
                          type="text"
                          value={form.nome}
                          onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
                          placeholder="Nome"
                        />
                      ) : (
                        user?.nome || '—'
                      )}
                    </dd>
                  </div>
                  <div className="ficha-row">
                    <dt>E-mail</dt>
                    <dd>
                      {editing ? (
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                          placeholder="E-mail"
                        />
                      ) : (
                        user?.email || '—'
                      )}
                    </dd>
                  </div>
                  <div className="ficha-row">
                    <dt>ID</dt>
                    <dd>#{user?.usuarioId ?? '—'}</dd>
                  </div>
                </dl>
              </div>

              <div className="ficha-section ficha-section-dados">
                <h3>Dados físicos</h3>
                <dl className="ficha-lista ficha-grid">
                  <div className="ficha-row">
                    <dt>Peso</dt>
                    <dd>
                      {editing ? (
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={form.peso}
                          onChange={(e) => setForm((f) => ({ ...f, peso: e.target.value }))}
                          placeholder="kg"
                        />
                      ) : (
                        formatPeso(user?.peso)
                      )}
                    </dd>
                  </div>
                  <div className="ficha-row">
                    <dt>Altura</dt>
                    <dd>
                      {editing ? (
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={form.altura}
                          onChange={(e) => setForm((f) => ({ ...f, altura: e.target.value }))}
                          placeholder="m"
                        />
                      ) : (
                        formatAltura(user?.altura)
                      )}
                    </dd>
                  </div>
                  <div className="ficha-row">
                    <dt>Sexo</dt>
                    <dd>
                      {editing ? (
                        <select
                          value={form.sexo}
                          onChange={(e) => setForm((f) => ({ ...f, sexo: e.target.value }))}
                        >
                          <option value="">—</option>
                          <option value="M">Masculino</option>
                          <option value="F">Feminino</option>
                        </select>
                      ) : (
                        formatSexo(user?.sexo)
                      )}
                    </dd>
                  </div>
                  <div className="ficha-row">
                    <dt>Idade</dt>
                    <dd>—</dd>
                  </div>
                </dl>
                <p className="ficha-dica">Idade pode ser incluída em uma próxima versão.</p>
              </div>
            </div>
          </section>

          <aside className="ficha-sidebar">
            <div className="ficha-resumo">
              <div className="ficha-resumo-avatar">
                <i className="bi bi-person" aria-hidden></i>
              </div>
              <p className="ficha-resumo-nome">{user?.nome || 'Usuário'}</p>
              <p className="ficha-resumo-email">{user?.email || ''}</p>
            </div>
            <div className="ficha-stat">
              <span className="ficha-stat-valor">{stats.totalListas}</span>
              <span className="ficha-stat-label">Listas criadas</span>
            </div>
            <button type="button" className="btn-logout" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right" aria-hidden></i>
              Sair da conta
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Usuario;
