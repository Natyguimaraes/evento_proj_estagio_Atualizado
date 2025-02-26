import { useState } from "react";
import "../css/convidado.css";

function CadastroConvidados() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [acompanhante, setAcompanhante] = useState("");
  const [eventoId, setEventoId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCadastro = async () => {
    setError("");
    setSuccess("");

    if (!nome || !telefone || !eventoId) {
      setError("Nome, telefone e ID do evento são obrigatórios.");
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
          acompanhante,
          evento_id: eventoId,
        }),
      });

      const dados = await resposta.json();

      if (resposta.ok) {
        setSuccess("Convidado cadastrado com sucesso!");
        setNome("");
        setTelefone("");
        setEmail("");
        setAcompanhante("");
        setEventoId("");
      } else {
        setError(dados.erro || "Erro ao cadastrar convidado.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError("Erro ao cadastrar convidado. Tente novamente mais tarde.");
    }
  };

  return (
    <div className="convidado-container">
      <div className="cad-convidado">
        <h2>Cadastro de Convidados</h2>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

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
        <input
          className="input-convidado"
          type="number"
          placeholder="Número de acompanhantes"
          value={acompanhante}
          onChange={(e) => setAcompanhante(e.target.value)}
        />
        <input
          className="input-convidado"
          type="number"
          placeholder="ID do Evento"
          value={eventoId}
          onChange={(e) => setEventoId(e.target.value)}
        />
        <button className="button-convidado" onClick={handleCadastro}>
          Cadastrar
        </button>
      </div>
    </div>
  );
}

export default CadastroConvidados;
