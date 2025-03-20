import React, { useState } from "react";

const CadastrarPlano = () => {
  const [nome, setNome] = useState("");
  const [maxAcompanhantes, setMaxAcompanhantes] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validação dos campos
    if (!nome || !maxAcompanhantes) {
      setErro("Nome e máximo de acompanhantes são obrigatórios.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/superadmin/planos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome,
          maxAcompanhantes: parseInt(maxAcompanhantes), // Converte para número
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar plano");
      }

      const data = await response.json();
      alert(data.message || "Plano cadastrado com sucesso!"); // Exibe mensagem de sucesso
      setNome("");
      setMaxAcompanhantes("");
      setErro(""); // Limpa a mensagem de erro
    } catch (error) {
      console.error("Erro ao cadastrar plano:", error);
      setErro("Erro ao cadastrar plano. Tente novamente."); // Exibe mensagem de erro
    }
  };

  return (
    <div style={styles.container}>
      <h2>Cadastrar Plano</h2>
      {erro && <p style={{ color: "red" }}>{erro}</p>} {/* Exibe mensagem de erro */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Nome do Plano:</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div style={styles.formGroup}>
          <label>Máximo de Acompanhantes:</label>
          <input
            type="number"
            value={maxAcompanhantes}
            onChange={(e) => setMaxAcompanhantes(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={styles.button}>
          Cadastrar
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "400px",
    margin: "0 auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "15px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default CadastrarPlano;