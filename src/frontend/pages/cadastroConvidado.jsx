import { useState } from 'react';

function CadastroConvidados() {
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [email, setEmail] = useState('');
    const [eventoId, setEventoId] = useState('');

    const handleCadastro = async () => {
        const resposta = await fetch('http://localhost:5000/api/convidados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, telefone, email, evento_id: eventoId })
        });
        const dados = await resposta.json();
        if (resposta.ok) alert('Convidado cadastrado com sucesso');
        else alert(dados.erro);
    };

    return (
        <div>
            <h2>Cadastro de Convidados</h2>
            <input type='text' placeholder='Nome' value={nome} onChange={e => setNome(e.target.value)} />
            <input type='text' placeholder='Telefone' value={telefone} onChange={e => setTelefone(e.target.value)} />
            <input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
            <input type='number' placeholder='ID do Evento' value={eventoId} onChange={e => setEventoId(e.target.value)} />
            <button onClick={handleCadastro}>Cadastrar</button>
        </div>
    );
}
export default CadastroConvidados;