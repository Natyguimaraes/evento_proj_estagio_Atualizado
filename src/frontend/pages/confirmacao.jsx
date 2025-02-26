import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaWhatsapp } from 'react-icons/fa';
import '../css/confirmacao.css';

function Confirmacao() {
    const [eventos, setEventos] = useState([]);
    const [convidados, setConvidados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState(null);

    useEffect(() => {
        async function fetchDados() {
            setLoading(true);
            try {
                const eventosResponse = await fetch('http://localhost:5000/api/eventos');
                if (!eventosResponse.ok) {
                    const errorData = await eventosResponse.json();
                    throw new Error(errorData.message || 'Erro ao buscar eventos');
                }
                const eventosData = await eventosResponse.json();
                setEventos(eventosData);

                const convidadosResponse = await fetch('http://localhost:5000/api/convidados');
                if (!convidadosResponse.ok) {
                    const errorData = await convidadosResponse.json();
                    throw new Error(errorData.message || 'Erro ao buscar convidados');
                }
                const convidadosData = await convidadosResponse.json();
                setConvidados(convidadosData);
            } catch (error) {
                console.error('Erro ao buscar dados:', error.message);
                alert(`Erro ao buscar dados: ${error.message}.`);
            } finally {
                setLoading(false);
            }
        }
        fetchDados();
    }, []);

    const handleEdit = (id) => {
        setEditIndex(id);
    };

    const handleDelete = async (id) => {
        const confirmacao = window.confirm('Tem certeza que deseja excluir este convidado?');
        if (confirmacao) {
            try {
                const response = await fetch(`http://localhost:5000/api/convidados/${id}`, { method: 'DELETE' });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erro ao excluir convidado');
                }
                setConvidados(prev => prev.filter(item => item.id !== id));
                alert('Convidado excluído com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir convidado:', error.message);
                alert(`Erro ao excluir convidado: ${error.message}. Tente novamente.`);
            }
        }
    };

    const enviarWhatsapp = (telefone, nome, evento_id) => {
        const nomeEvento = eventos.find(e => Number(e.id) === Number(evento_id))?.nome || 'Evento não encontrado';
        const mensagem = `Olá ${nome}, você está convidado para o evento "${nomeEvento}"! Por favor, confirme sua presença.`;
        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    };

    const handleUpdate = async (index) => {
        try {
            const convidado = { ...convidados[index] };

            // ... (código para atualizar o convidado)

            setConvidados(prev => {
                const newData = [...prev];
                newData[index] = convidadoAtualizado;
                return newData;
            });

            setEditIndex(null);
            alert(`Convidado "${convidadoAtualizado.nome}" atualizado com sucesso!`);
        } catch (error) {
            // ...
        }
    };

    return (
        <div className="confirmacao-container">
            <h1>Lista de Convidados por Evento</h1>
            {loading ? (
                <p>Carregando dados...</p>
            ) : (
                eventos.map(evento => (
                    <div className="convidado-card" key={evento.id}>
                        <div className="card-header">
                            <h3>{evento.nome}</h3>
                        </div>
                        <div className="card-content">
                            {convidados
                                .filter(convidado => Number(convidado.evento_id) === Number(evento.id))
                                .map((convidado, index) => (
                                    <div key={convidado.id} className="convidado-item">
                                        <p><strong>Nome:</strong> {convidado.nome}</p>
                                        <p><strong>Telefone:</strong> {convidado.telefone}</p>
                                        <p><strong>Email:</strong> {convidado.email}</p>
                                        <p><strong>Acompanhantes:</strong> {convidado.acompanhante}</p>
                                        <div className="acoes-card">
                                            <FaEdit onClick={() => handleEdit(convidado.id)} />
                                            <FaTrash onClick={() => handleDelete(convidado.id)} />
                                            <FaWhatsapp onClick={() => enviarWhatsapp(convidado.telefone, convidado.nome, evento.id)} />
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Confirmacao;