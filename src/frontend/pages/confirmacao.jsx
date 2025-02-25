import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit } from 'react-icons/fa';

function Confirmacao() {
    const [dadosCadastrados, setDadosCadastrados] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        async function fetchDados() {
            try {
                // Buscar convidados
                const convidadosResponse = await fetch('http://localhost:5000/api/convidados');
                if (!convidadosResponse.ok) throw new Error('Erro ao buscar convidados');
                const convidados = await convidadosResponse.json();
                setDadosCadastrados(convidados);
                console.log("Convidados carregados:", convidados);

                // Buscar eventos
                const eventosResponse = await fetch('http://localhost:5000/api/eventos');
                if (!eventosResponse.ok) throw new Error('Erro ao buscar eventos');
                const eventosData = await eventosResponse.json();
                setEventos(eventosData);
                console.log("Eventos carregados:", eventosData);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        }
        fetchDados();
    }, []);

    // Função para buscar o nome do evento pelo ID
    const getNomeEvento = (evento_id) => {
        if (!eventos.length) return 'Carregando...';
        
        console.log('Buscando evento para ID:', evento_id); // Debugging

        // Garantir que os IDs sejam comparados corretamente como números
        const eventoEncontrado = eventos.find(e => Number(e.id) === Number(evento_id));

        if (eventoEncontrado) {
            console.log('Evento encontrado:', eventoEncontrado.nome);
            return eventoEncontrado.nome;
        }

        return 'Evento não encontrado';
    };

    return (
        <div className="container_tabela">
            <h1> Lista de Convidados </h1>
            {eventos.length === 0 ? <p>Carregando eventos...</p> : (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Telefone</th>
                            <th>Email</th>
                            <th>Acompanhantes</th>
                            <th>Evento</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dadosCadastrados.map((convidado, index) => (
                            <tr key={convidado.id}>
                                <td>{convidado.id}</td>
                                <td>{convidado.nome}</td>
                                <td>{convidado.telefone}</td>
                                <td>{convidado.email}</td>
                                <td>{convidado.acompanhante}</td>
                                <td>{getNomeEvento(convidado.evento_id)}</td>
                                <td>
                                    <FaTrash onClick={() => console.log('Deletar', convidado.id)} />
                                    <FaEdit onClick={() => console.log('Editar', convidado.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Confirmacao;
