import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

function LoginAdministrador() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/administradores/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao processar solicitação");
      }

      setMessage(data.message);
      console.log("Admin logado:", data.admin);
      navigate("/eventos");
      
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="login-admin-container">
      <div className="login-admin-form-box">
        <h1>Login de Administrador</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
            className="login-admin-input"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            className="login-admin-input"
          />
          <button className="login-admin-button" type="submit">
            Entrar
          </button>
        </form>
        {message && <p className="login-admin-error-message">{message}</p>}
        <button className="login-admin-button" onClick={() => navigate("/cadastro")}>Ainda não tem conta? Cadastre-se</button>
      </div>
    </div>
  );
}

export default LoginAdministrador;
