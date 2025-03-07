import { useState, useEffect } from "react";
import "../css/convidado.css";

function CadastroConvidados() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [eventoId, setEventoId] = useState("");
  const [desejaInformarCandidato, setDesejaInformarCandidato] = useState(false);
  const [acompanhantes, setAcompanhantes] = useState([]);
  const [error, setError] = useState("");
  const [eventos, setEventos] = useState([]);

  useEffect(() => {
 
    const carregarEventos = async () => {
      try {
        const resposta = await fetch("http://localhost:5000/api/eventos");
        const dados = await resposta.json();
        if (resposta.ok) {
          setEventos(dados); 
        } else {
          setError(dados.erro || "Erro ao carregar eventos.");
        }
      } catch (err) {
        console.error("Erro na requisição de eventos:", err);
        setError("Erro ao carregar eventos. Tente novamente mais tarde.");
      }
    };

    carregarEventos();
  }, []);

  const handleToggleCandidato = () => {
    setDesejaInformarCandidato(!desejaInformarCandidato);
    setAcompanhantes([]);
  };

  const handleAddAcompanhante = () => {
    setAcompanhantes([...acompanhantes, { nome: "", telefone: "", email: "" }]);
  };

  const handleChangeAcompanhante = (index, field, value) => {
    const updatedAcompanhantes = [...acompanhantes];
    updatedAcompanhantes[index][field] = value;
    setAcompanhantes(updatedAcompanhantes);
  };

  const handleCadastro = async () => {
    setError("");

    if (!nome || !telefone || !eventoId) {
      setError("Nome, telefone e evento são obrigatórios.");
      return;
    }

    try {
      const resposta = await fetch("http://localhost:5000/api/convidados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          telefone,
          email,
          evento_id: eventoId,
          acompanhantes,
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        alert("Convidado cadastrado com sucesso!");
        setNome("");
        setTelefone("");
        setEmail("");
        setEventoId("");
        setDesejaInformarCandidato(false);
        setAcompanhantes([]);
      } else {
        setError(dados.erro || "Erro ao cadastrar convidado.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError("Erro ao cadastrar convidado. Tente novamente mais tarde.");
    }
  };

  return (
    <>
      <div className="cabecalho">
        <h1>SISTEMA EVENTOS</h1>
      </div>
      <div className="convidado-container">
        <div className="cad-convidado">
          <h2>Cadastro de Convidados</h2>

          {error && <p className="error-message">{error}</p>}

          <input
            className="input-convidado"
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            className="input-convidado"
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
          <input
            className="input-convidado"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className="input-convidado"
            value={eventoId}
            onChange={(e) => setEventoId(e.target.value)}
          >
            <option value="">Selecione um evento</option>
            {eventos.map((evento) => (
              <option key={evento.id} value={evento.id}>
                {evento.nome}
              </option>
            ))}
          </select>

          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={desejaInformarCandidato}
              onChange={handleToggleCandidato}
            />
            Deseja informar acompanhantes?
          </label>

          {desejaInformarCandidato && (
            <div className="acompanhantes-container">
              {acompanhantes.map((acompanhante, index) => (
                <div key={index} className="acompanhante-card">
                  <h4>Acompanhante {index + 1}</h4>
                  <input
                    className="input-convidado"
                    type="text"
                    placeholder="Nome"
                    value={acompanhante.nome}
                    onChange={(e) => handleChangeAcompanhante(index, "nome", e.target.value)}
                  />
                  <input
                    className="input-convidado"
                    type="text"
                    placeholder="Telefone"
                    value={acompanhante.telefone}
                    onChange={(e) => handleChangeAcompanhante(index, "telefone", e.target.value)}
                  />
                  <input
                    className="input-convidado"
                    type="email"
                    placeholder="Email"
                    value={acompanhante.email}
                    onChange={(e) => handleChangeAcompanhante(index, "email", e.target.value)}
                  />
                </div>
              ))}
              <button className="button-add" onClick={handleAddAcompanhante}>
                + Adicionar Acompanhante
              </button>
            </div>
          )}
          <button className="button-convidado" onClick={handleCadastro}>
            Cadastrar
          </button>
        </div>
      </div>
    </>
  );
}

export default CadastroConvidados;



