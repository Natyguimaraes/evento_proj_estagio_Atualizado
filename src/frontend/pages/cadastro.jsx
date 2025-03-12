import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/cadastroAdm.css";

function CadastroAdministrador() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const validarCPF = (cpf) => /^\d{11}$/.test(cpf);
    const validarSenha = (senha) => senha.length >= 8;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!nome.trim()) return setMessage("Nome é obrigatório.");
        if (!validarCPF(cpf)) return setMessage("CPF inválido. Digite 11 números.");
        if (!validarSenha(senha)) return setMessage("A senha deve ter no mínimo 8 caracteres.");

        try {
            const response = await fetch("http://localhost:5000/api/administradores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, cpf, senha }),
            });
            const data = await response.json();
            if (response.ok) navigate("/eventos");
            else setMessage(data.message || "Erro ao cadastrar administrador.");
        } catch (error) {
            setMessage("Erro ao conectar ao servidor.");
        }
    };

    return (
        <div className="cadastro-admin-container">
            <div className="cadastro-admin-form-box">
                <h1>Cadastro de Administrador</h1>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Nome" 
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                        className="cadastro-admin-input"
                    />
                    <input 
                        type="text" 
                        placeholder="CPF" 
                        value={cpf} 
                        onChange={(e) => setCpf(e.target.value)} 
                        className="cadastro-admin-input"
                    />
                    <input 
                        type="password" 
                        placeholder="Senha" 
                        value={senha} 
                        onChange={(e) => setSenha(e.target.value)} 
                        className="cadastro-admin-input"
                    />
                    <button type="submit" className="cadastro-admin-button">Cadastrar</button>
                    {message && <p className="cadastro-admin-error-message">{message}</p>}
                </form>
                <button className="cad-admin-button" onclick={() => navigate("/login")}> Já possuo cadastro! </button>
            </div>
        </div>
    );
}

export default CadastroAdministrador;