import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { MUSCULOS, swalDark } from '../../api/client';

const DIFICULDADES = ['Iniciante', 'Intermediário', 'Iniciante a intermediário'];
const CAMINHO_IMAGEM = '../ExerciciosGif/';

export default function AdminExercises() {
  const { request } = useAuth();
  const [exercicios, setExercicios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [form, setForm] = useState({});
  const [criarAberto, setCriarAberto] = useState(false);
  const [novo, setNovo] = useState({
    nome: '',
    musculo: '',
    equipamento: '',
    dificuldade: '',
    instrucao: '',
    tipo: '',
    arquivo: null
  });
  const [instrucaoModal, setInstrucaoModal] = useState(null);
  const [editandoInstrucao, setEditandoInstrucao] = useState(false);
  const [textoInstrucao, setTextoInstrucao] = useState('');

  async function carregar() {
    const obj = await request('/exercicios', { method: 'get' });
    if (obj.status === true) {
      setExercicios(obj.dados || []);
    } else {
      alert('Login invalido!');
    }
  }

  useEffect(() => {
    carregar();
  }, [request]);

  async function criar() {
    const obj = await request('/exercicios', {
      method: 'post',
      body: JSON.stringify({
        nome: novo.nome,
        musculo: novo.musculo,
        equipamento: novo.equipamento,
        dificuldade: novo.dificuldade,
        instrucao: novo.instrucao,
        tipo: novo.tipo,
        imagem: novo.arquivo ? CAMINHO_IMAGEM + novo.arquivo.name : ''
      })
    });
    setCriarAberto(false);
    if (obj.status === true) {
      Swal.fire({
        ...swalDark,
        title: 'Sucesso!',
        text: 'Exercicio criado com sucesso!',
        icon: 'success'
      });
      carregar();
    } else {
      alert('login invalido');
    }
  }

  async function atualizar(exercicioId, dados) {
    const obj = await request('/exercicios/' + exercicioId, {
      method: 'put',
      body: JSON.stringify(dados)
    });
    if (obj.status === true) {
      setEditandoId(null);
      setInstrucaoModal(null);
      setEditandoInstrucao(false);
      Swal.fire({
        ...swalDark,
        title: 'Sucesso!',
        text: 'Exercicio editado com sucesso!',
        icon: 'success'
      });
      carregar();
    } else {
      alert('login Invalido!');
    }
  }

  async function excluir(id) {
    const result = await Swal.fire({
      title: 'Você tem certeza?',
      text: 'Você não poderá reverter a sua escolha!',
      icon: 'warning',
      showCancelButton: true,
      ...swalDark,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar!',
      confirmButtonText: 'Sim!'
    });
    if (!result.isConfirmed) {
      return;
    }
    const obj = await request('/exercicios/' + id, { method: 'delete' });
    if (obj.status === true) {
      Swal.fire({
        ...swalDark,
        title: 'Excluido!',
        text: 'Exercicio excluido!.',
        icon: 'success'
      });
      carregar();
    } else {
      alert('Login invalido');
    }
  }

  function iniciarEdicao(exercicio) {
    setEditandoId(exercicio.idexercicio);
    setForm({
      nome: exercicio.nome,
      musculo: exercicio.musculo,
      equipamento: exercicio.equipamento,
      dificuldade: exercicio.dificuldade,
      tipo: exercicio.tipo,
      arquivo: null,
      instrucao: exercicio.instrucao,
      imagem: exercicio.imagem
    });
  }

  function salvarLinha(exercicio) {
    atualizar(exercicio.idexercicio, {
      nome: form.nome,
      musculo: form.musculo,
      equipamento: form.equipamento,
      dificuldade: form.dificuldade,
      instrucao: exercicio.instrucao,
      tipo: form.tipo,
      imagem: form.arquivo ? CAMINHO_IMAGEM + form.arquivo.name : exercicio.imagem
    });
  }

  const visiveis = exercicios.filter((exercicio) => {
    if (!filtro) {
      return true;
    }
    return (exercicio.nome || '').toLowerCase().includes(filtro.toLowerCase());
  });

  return (
    <div>
      <div className="uf-page-head">
        <div>
          <h1>Exercícios</h1>
          <p>Catálogo usado pelos alunos no portal.</p>
        </div>
        <button type="button" className="uf-btn-primary" id="Create-exer" onClick={() => setCriarAberto(true)}>
          <span className="material-symbols-outlined">add</span>
          Novo exercício
        </button>
      </div>
      <div className="uf-toolbar">
        <div className="uf-search">
          <span className="material-symbols-outlined">search</span>
          <input type="text" id="txtFiltro" className="uf-input" placeholder="Filtro" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
        </div>
      </div>
      <div className="uf-card uf-table-wrap">
        <table className="uf-table" id="tblExercicios">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Músculo</th>
              <th>Equipamento</th>
              <th>Dificuldade</th>
              <th>Instrução</th>
              <th>Tipo</th>
              <th>Imagem</th>
              <th>Excluir</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {visiveis.length === 0 ? (
              <tr>
                <td colSpan="10" className="uf-empty">Nenhum exercício encontrado.</td>
              </tr>
            ) : visiveis.map((exercicio) => (
              <tr key={exercicio.idexercicio}>
                {editandoId === exercicio.idexercicio ? (
                  <>
                    <td>{exercicio.idexercicio}</td>
                    <td><input type="text" className="uf-input" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></td>
                    <td>
                      <select className="uf-select" value={form.musculo} onChange={(e) => setForm({ ...form, musculo: e.target.value })}>
                        <option value="" disabled>Musculo</option>
                        {MUSCULOS.map((musculo) => (
                          <option key={musculo} value={musculo}>{musculo}</option>
                        ))}
                      </select>
                    </td>
                    <td><input type="text" className="uf-input" value={form.equipamento} onChange={(e) => setForm({ ...form, equipamento: e.target.value })} /></td>
                    <td>
                      <select className="uf-select" value={form.dificuldade} onChange={(e) => setForm({ ...form, dificuldade: e.target.value })}>
                        <option value="" disabled>Dificuldade</option>
                        {DIFICULDADES.map((item) => (
                          <option key={item} value={item}>{item}</option>
                        ))}
                      </select>
                    </td>
                    <td></td>
                    <td><input type="text" className="uf-input" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} /></td>
                    <td><input type="file" onChange={(e) => setForm({ ...form, arquivo: e.target.files[0] })} /></td>
                    <td colSpan="2">
                      <button type="button" className="uf-btn-primary" onClick={() => salvarLinha(exercicio)}>Salvar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{exercicio.idexercicio}</td>
                    <td>{exercicio.nome}</td>
                    <td>{exercicio.musculo}</td>
                    <td>{exercicio.equipamento}</td>
                    <td>{exercicio.dificuldade}</td>
                    <td>
                      <button type="button" className="uf-btn-ghost btn-instrucao" onClick={() => {
                        setInstrucaoModal(exercicio);
                        setTextoInstrucao(exercicio.instrucao);
                        setEditandoInstrucao(false);
                      }}>Ver instrução</button>
                    </td>
                    <td>{exercicio.tipo}</td>
                    <td>{exercicio.imagem}</td>
                    <td>
                      <button type="button" className="uf-btn-danger btn-excluir" onClick={() => excluir(exercicio.idexercicio)}>Excluir</button>
                    </td>
                    <td>
                      <button type="button" className="uf-btn-edit btn-editar" onClick={() => iniciarEdicao(exercicio)}>Editar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {instrucaoModal && (
        <div className="uf-modal" onClick={() => setInstrucaoModal(null)}>
          <div className="uf-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="uf-modal-close" onClick={() => setInstrucaoModal(null)}>&times;</button>
            <div className="uf-modal-form">
              {editandoInstrucao ? (
                <>
                  <textarea className="uf-textarea" value={textoInstrucao} onChange={(e) => setTextoInstrucao(e.target.value)} />
                  <button type="button" className="uf-btn-primary button-save" onClick={() => atualizar(instrucaoModal.idexercicio, {
                    nome: instrucaoModal.nome,
                    musculo: instrucaoModal.musculo,
                    equipamento: instrucaoModal.equipamento,
                    dificuldade: instrucaoModal.dificuldade,
                    instrucao: textoInstrucao,
                    tipo: instrucaoModal.tipo,
                    imagem: instrucaoModal.imagem
                  })}>Salvar</button>
                </>
              ) : (
                <>
                  <p>{textoInstrucao}</p>
                  <button type="button" className="uf-btn-edit button-modal" onClick={() => setEditandoInstrucao(true)}>Editar</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {criarAberto && (
        <div className="uf-modal" onClick={() => setCriarAberto(false)}>
          <div className="uf-modal-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="uf-modal-close" onClick={() => setCriarAberto(false)}>&times;</button>
            <div className="uf-modal-form">
              <h2>Novo exercício</h2>
              <input type="text" className="uf-input" placeholder="Nome" value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} />
              <select className="uf-select" value={novo.musculo} onChange={(e) => setNovo({ ...novo, musculo: e.target.value })}>
                <option value="" disabled>Musculo</option>
                {MUSCULOS.map((musculo) => (
                  <option key={musculo} value={musculo}>{musculo}</option>
                ))}
              </select>
              <input type="text" className="uf-input" placeholder="Equipamento" value={novo.equipamento} onChange={(e) => setNovo({ ...novo, equipamento: e.target.value })} />
              <select className="uf-select" value={novo.dificuldade} onChange={(e) => setNovo({ ...novo, dificuldade: e.target.value })}>
                <option value="" disabled>Dificuldade</option>
                {DIFICULDADES.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <textarea className="uf-textarea" placeholder="Instrução" value={novo.instrucao} onChange={(e) => setNovo({ ...novo, instrucao: e.target.value })} />
              <input type="text" className="uf-input" placeholder="Tipo" value={novo.tipo} onChange={(e) => setNovo({ ...novo, tipo: e.target.value })} />
              <input type="file" onChange={(e) => setNovo({ ...novo, arquivo: e.target.files[0] })} />
              <button type="submit" className="uf-btn-primary" onClick={criar}>Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
