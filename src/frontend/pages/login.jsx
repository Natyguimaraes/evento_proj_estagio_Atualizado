// frontend/src/pages/LoginAdministrador.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginAdministrador() {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const resposta = await fetch('http://localhost:5000/api/administradores/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cpf, senha })
        });

        const dados = await resposta.json();
        if (resposta.ok) {
            alert('Login realizado com sucesso!');
            navigate('/dashboard'); // Redireciona para o painel após login
        } else {
            alert(dados.erro);
        }
    };

    return (
        <div>
            <h2>Login do Administrador</h2>
            <input type="text" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />
            <input type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
            <button onClick={handleLogin}>Entrar</button>
        </div>
    );
}

export default LoginAdministrador;
