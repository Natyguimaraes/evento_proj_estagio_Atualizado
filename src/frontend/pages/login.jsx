import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

function LoginAdministrador() {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [nome, setNome] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const url = isLogin
      ? "http://localhost:5000/api/administradores/login"
      : "http://localhost:5000/api/administradores/register";
    const body = isLogin ? { cpf, senha } : { nome, cpf, senha };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao processar solicitação");
      }

      setMessage(data.message);
      if (isLogin) {
        console.log("Admin logado:", data.admin);
        navigate("/dashboard");
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
   
      <><div className="cabecalho">
      <h1>SISTEMA EVENTOS</h1>
    </div><div className="container">
        <h2>
          {!isLogin ? "Cadastro de Administrador" : "Login de Administrador"}
        </h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required />
          )}
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required />
          <button className="login-button" type="submit">
            {isLogin ? "Entrar" : "Cadastrar"}
          </button>
        </form>
        {message && <p>{message}</p>}
        <button className="login-button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Ainda não tem conta? Cadastre-se"
            : "Já tem conta? Faça login"}
        </button>
      </div></>
  );
}

export default LoginAdministrador;
