// frontend/src/pages/LoginAdministrador.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/login.css';

function LoginAdministrador() {
    const [cpf, setCpf] = useState('');
    const [senha, setSenha] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState(''); // Estado para exibir mensagens de erro

    const handleLogin = async () => {
        setError(''); // Limpa mensagens de erro anteriores

        try {
            const resposta = await fetch('http://localhost:5000/api/administradores/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf, senha }),
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                alert('Login realizado com sucesso!');
                navigate('/dashboard');
            } else {
                setError(dados.erro || 'Erro ao fazer login. Verifique suas credenciais.'); // Exibe a mensagem de erro do servidor ou uma mensagem genérica
            }
        } catch (err) {
            console.error("Erro na requisição:", err);
            setError('Erro ao fazer login. Tente novamente mais tarde.'); // Mensagem de erro genérica para erros de rede, etc.
        }
    };

    return (
        <div className="login-container"> {/* Container principal */}
            <div className="login-div"> {/* Div para o formulário de login */}
                <h2>Login do Administrador</h2>

                {error && <p className="error-message">{error}</p>} {/* Exibe a mensagem de erro se houver */}

                <input
                    className="input-login"
                    type="text"
                    placeholder="CPF"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                />
                <input
                    className="input-login"
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <button className="button-login" onClick={handleLogin}>
                    Entrar
                </button>
            </div>
        </div>
    );
}

export default LoginAdministrador;