import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaWhatsapp } from 'react-icons/fa';

function Confirmacao() {
    const [dadosCadastrados, setDadosCadastrados] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        async function fetchDados() {
            try {
                const convidadosResponse = await fetch('http://localhost:5000/api/convidados');
                if (!convidadosResponse.ok) throw new Error('Erro ao buscar convidados');
                const convidados = await convidadosResponse.json();
                setDadosCadastrados(convidados);

                const eventosResponse = await fetch('http://localhost:5000/api/eventos');
                if (!eventosResponse.ok) throw new Error('Erro ao buscar eventos');
                const eventosData = await eventosResponse.json();
                setEventos(eventosData);
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            }
        }
        fetchDados();
    }, []);

    const getNomeEvento = (evento_id) => {
        if (!eventos.length) return 'Carregando...';
        const eventoEncontrado = eventos.find(e => Number(e.id) === Number(evento_id));
        return eventoEncontrado ? eventoEncontrado.nome : 'Evento não encontrado';
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/convidados/${id}`, { method: 'DELETE' });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao excluir convidado');
            }
    
            setDadosCadastrados(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error('Erro ao excluir convidado:', error);
            alert('Erro ao excluir convidado. Tente novamente.');
        }
    };
    

    const handleEdit = (index) => {
        setEditIndex(index);
    };

    const handleUpdate = async (index) => {
        try {
            const convidado = dadosCadastrados[index];
            const response = await fetch(`http://localhost:5000/api/convidados/${convidado.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    confirmado: convidado.confirmado,  
                    acompanhantes: convidado.acompanhantes // Incluindo acompanhantes
                })
            });
    
            if (!response.ok) throw new Error('Erro ao atualizar convidado');
            setEditIndex(null);
        } catch (error) {
            console.error('Erro ao atualizar convidado:', error);
        }
    };
    
    const handleChange = (e, index) => {
        const { name, value } = e.target;
        setDadosCadastrados(prev => {
            const newData = [...prev];
            newData[index] = { ...newData[index], [name]: value };
            return newData;
        });
    };

    const enviarWhatsapp = (telefone, nome, evento_id) => {
        const nomeEvento = getNomeEvento(evento_id);
        const mensagem = `Olá ${nome}, você está convidado para o evento "${nomeEvento}"! Por favor, confirme sua presença.`;
        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
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
                                <td>
                                    {editIndex === index ? (
                                        <input type="text" name="nome" value={convidado.nome} onChange={(e) => handleChange(e, index)} />
                                    ) : (
                                        convidado.nome
                                    )}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <input type="text" name="telefone" value={convidado.telefone} onChange={(e) => handleChange(e, index)} />
                                    ) : (
                                        convidado.telefone
                                    )}
                                </td>
                                <td>{convidado.email}</td>
                                <td>{convidado.acompanhante}</td>
                                <td>{getNomeEvento(convidado.evento_id)}</td>
                                <td>
                                    <FaTrash onClick={() => handleDelete(convidado.id)} />
                                    {editIndex === index ? (
                                        <button className="salvar-button" onClick={() => handleUpdate(index)}> Salvar </button>
                                    ) : (
                                        <FaEdit onClick={() => handleEdit(index)} />
                                    )}
                                    <FaWhatsapp onClick={() => enviarWhatsapp(convidado.telefone, convidado.nome, convidado.evento_id)} />
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
