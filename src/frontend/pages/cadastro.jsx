import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CadastroAdministrador() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const validarCPF = (cpf) => {
        return /^\d{11}$/.test(cpf); // Verifica se o CPF tem 11 dígitos numéricos
    };

    const validarSenha = (senha) => {
        return senha.length >= 8; // Exige no mínimo 6 caracteres
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage("");

        if (!nome.trim()) {
            setMessage("Nome é obrigatório.");
            return;
        }

        if (!validarCPF(cpf)) {
            setMessage("CPF inválido. Digite apenas números, com 11 dígitos.");
            return;
        }

        if (!validarSenha(senha)) {
            setMessage("A senha deve ter no mínimo 8 caracteres.");
            return;
        }

        // Se todas as validações passarem, redireciona para o dashboard
        navigate("/eventos");
    };

    return (
        <div>
            <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
            />
            <input
                type="text"
                placeholder="CPF"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
            />
            <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />
            <button onClick={handleSubmit}>Cadastrar</button>

            {message && <p style={{ color: "red" }}>{message}</p>}
        </div>
    );
}

export default CadastroAdministrador;
