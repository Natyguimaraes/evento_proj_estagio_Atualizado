import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CadastroAdministrador() {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [senha, setSenha] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        navigate('./dashboard');
    }

    return (
        <>
        <div> 
            <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)} />
            <input 
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)} />

            <input 
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) =>setSenha(e.target.value)} />
            <button onClick={handleSubmit}>Cadastrar </button>
        </div>
        </>
    )
}
export default CadastroAdministrador