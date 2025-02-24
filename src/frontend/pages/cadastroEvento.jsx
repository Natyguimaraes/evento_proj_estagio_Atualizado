import { useState } from 'react';

function CadastroEventos() {
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataEvento, setDataEvento] = useState('');

    const handleCadastro = async () => {
        const resposta = await fetch('http://localhost:5000/api/eventos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, descricao, data_evento: dataEvento })
        });
        const dados = await resposta.json();
        if (resposta.ok) alert('Evento cadastrado com sucesso');
        else alert(dados.erro);
    };

    return (
        <div>
            <h2>Cadastro de Eventos</h2>
            <input type='text' placeholder='Nome do Evento' value={nome} onChange={e => setNome(e.target.value)} />
            <input type='text' placeholder='Descrição' value={descricao} onChange={e => setDescricao(e.target.value)} />
            <input type='datetime-local' value={dataEvento} onChange={e => setDataEvento(e.target.value)} />
            <button onClick={handleCadastro}>Cadastrar</button>
        </div>
    );
}
export default CadastroEventos;