import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../auth/AuthContext';
import { MUSCULOS, swalDark } from '../../api/client';
import '../../css/table.css';
import '../../css/homepageAdm.css';

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
      Swal.fire({
        ...swalDark,
        title: 'Sessão expirada!',
        text: 'Não foi possível carregar os exercícios. Faça login novamente.',
        icon: 'error'
      });
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
      Swal.fire({
        ...swalDark,
        title: 'Erro!',
        text: 'Não foi possível criar o exercício. Verifique os dados e tente novamente.',
        icon: 'error'
      });
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
      Swal.fire({
        ...swalDark,
        title: 'Erro!',
        text: 'Não foi possível salvar as alterações do exercício.',
        icon: 'error'
      });
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
      Swal.fire({
        ...swalDark,
        title: 'Erro!',
        text: 'Não foi possível excluir o exercício.',
        icon: 'error'
      });
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
    <div className="tabela">
      <div className="cabeca">
        <h1>Exercicios</h1>
        <img
          src="/image/alem-disso-positivo-adicionar-simbolo-matematico.png"
          alt=""
          id="Create-exer"
          onClick={() => setCriarAberto(true)}
        />
      </div>
      <br />
      <input type="text" id="txtFiltro" placeholder="Filtro" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
      <br /><br />
      <div className="tabela-scroll">
      <table id="tblExercicios">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Musculo</th>
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
          {visiveis.map((exercicio) => (
            <tr key={exercicio.idexercicio}>
              {editandoId === exercicio.idexercicio ? (
                <>
                  <td>{exercicio.idexercicio}</td>
                  <td><input type="text" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></td>
                  <td>
                    <select value={form.musculo} onChange={(e) => setForm({ ...form, musculo: e.target.value })}>
                      <option value="" disabled>Musculo</option>
                      {MUSCULOS.map((musculo) => (
                        <option key={musculo} value={musculo}>{musculo}</option>
                      ))}
                    </select>
                  </td>
                  <td><input type="text" value={form.equipamento} onChange={(e) => setForm({ ...form, equipamento: e.target.value })} /></td>
                  <td>
                    <select value={form.dificuldade} onChange={(e) => setForm({ ...form, dificuldade: e.target.value })}>
                      <option value="" disabled>Dificuldade</option>
                      {DIFICULDADES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </td>
                  <td></td>
                  <td><input type="text" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} /></td>
                  <td><input type="file" onChange={(e) => setForm({ ...form, arquivo: e.target.files[0] })} /></td>
                  <td colSpan="2">
                    <button onClick={() => salvarLinha(exercicio)}>Salvar</button>
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
                    <button className="btn-instrucao" onClick={() => {
                      setInstrucaoModal(exercicio);
                      setTextoInstrucao(exercicio.instrucao);
                      setEditandoInstrucao(false);
                    }}>Ver Instrução</button>
                  </td>
                  <td>{exercicio.tipo}</td>
                  <td>{exercicio.imagem}</td>
                  <td>
                    <button className="btn-excluir" onClick={() => excluir(exercicio.idexercicio)}>Excluir</button>
                  </td>
                  <td>
                    <button className="btn-editar" onClick={() => iniciarEdicao(exercicio)}>Editar</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      {instrucaoModal && (
        <div className="modal aberto">
          <div className="modal-content">
            <span className="close-button" onClick={() => setInstrucaoModal(null)}>&times;</span>
            {editandoInstrucao ? (
              <>
                <textarea value={textoInstrucao} onChange={(e) => setTextoInstrucao(e.target.value)} />
                <button className="button-save" onClick={() => atualizar(instrucaoModal.idexercicio, {
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
                <button className="button-modal" onClick={() => setEditandoInstrucao(true)}>Editar</button>
              </>
            )}
          </div>
        </div>
      )}

      {criarAberto && (
        <div className="modal aberto">
          <div className="modal-content">
            <span className="close-button" onClick={() => setCriarAberto(false)}>&times;</span>
            <input type="text" placeholder="Nome" value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} />
            <select value={novo.musculo} onChange={(e) => setNovo({ ...novo, musculo: e.target.value })}>
              <option value="" disabled>Musculo</option>
              {MUSCULOS.map((musculo) => (
                <option key={musculo} value={musculo}>{musculo}</option>
              ))}
            </select>
            <input type="text" placeholder="Equipamento" value={novo.equipamento} onChange={(e) => setNovo({ ...novo, equipamento: e.target.value })} />
            <select value={novo.dificuldade} onChange={(e) => setNovo({ ...novo, dificuldade: e.target.value })}>
              <option value="" disabled>Dificuldade</option>
              {DIFICULDADES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <textarea placeholder="Instrução" value={novo.instrucao} onChange={(e) => setNovo({ ...novo, instrucao: e.target.value })} />
            <input type="text" placeholder="Tipo" value={novo.tipo} onChange={(e) => setNovo({ ...novo, tipo: e.target.value })} />
            <input type="file" onChange={(e) => setNovo({ ...novo, arquivo: e.target.files[0] })} />
            <button type="submit" onClick={criar}>Registrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
