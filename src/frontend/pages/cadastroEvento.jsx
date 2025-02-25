// frontend/src/CadastroEventos.jsx
import { useState } from 'react';
import "../css/eventos.css";

function CadastroEventos() {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataEvento, setDataEvento] = useState('');
    const [error, setError] = useState(''); // Estado para mensagens de erro
    const [success, setSuccess] = useState(''); // Estado para mensagens de sucesso

    const handleCadastro = async () => {
        setError('');
        setSuccess('');

        if (!nome || !descricao || !dataEvento) {
            setError("Todos os campos são obrigatórios.");
            return;
        }

        try {
            const resposta = await fetch('http://localhost:5000/api/eventos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, descricao, data_evento: dataEvento }),
            });

            const dados = await resposta.json();

            if (resposta.ok) {
                setSuccess('Evento cadastrado com sucesso!');
                setNome('');
                setDescricao('');
                setDataEvento('');
            } else {
                setError(dados.erro || 'Erro ao cadastrar evento.');
            }
        } catch (err) {
            console.error("Erro na requisição:", err);
            setError('Erro ao cadastrar evento. Tente novamente mais tarde.');
        }
    };

    return (
        <div className="eventos-container">
            <div className="div-eventos">
                <h2>Cadastro de Eventos</h2>

                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                <input
                    className="input-cad-evento"
                    type="text"
                    placeholder="Nome do Evento"
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                />
                <textarea
                    className="input-cad-evento descricao"
                    placeholder="Descrição"
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                />
                <input
                    className="input-cad-evento"
                    type="datetime-local"
                    value={dataEvento}
                    onChange={e => setDataEvento(e.target.value)}
                />
                <button className="button-evento" onClick={handleCadastro}>
                    Cadastrar
                </button>
            </div>
        </div>
    );
}

export default CadastroEventos;
