import React, { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaWhatsapp } from 'react-icons/fa';
import '../css/confirmacao.css';

function Confirmacao() {
    const [eventos, setEventos] = useState([]);
    const [convidados, setConvidados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({});

    useEffect(() => {
        async function fetchDados() {
            setLoading(true);
            try {
                const eventosResponse = await fetch('http://localhost:5000/api/eventos');
                if (!eventosResponse.ok) throw new Error('Erro ao buscar eventos');
                const eventosData = await eventosResponse.json();
                setEventos(eventosData);

                const convidadosResponse = await fetch('http://localhost:5000/api/convidados');
                if (!convidadosResponse.ok) throw new Error('Erro ao buscar convidados');
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
        const convidado = convidados.find(c => c.id === id);
        setEditIndex(id);
        setEditData(convidado);
    };

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/convidados/${editIndex}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editData),
            });
            if (!response.ok) throw new Error('Erro ao atualizar convidado');
            setConvidados(prev => prev.map(c => (c.id === editIndex ? editData : c)));
            setEditIndex(null);
            alert('Convidado atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar convidado:', error.message);
            alert(`Erro ao atualizar convidado: ${error.message}.`);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este convidado?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/convidados/${id}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Erro ao excluir convidado');
                setConvidados(prev => prev.filter(c => c.id !== id));
                alert('Convidado excluído com sucesso!');
            } catch (error) {
                console.error('Erro ao excluir convidado:', error.message);
                alert(`Erro ao excluir convidado: ${error.message}.`);
            }
        }
    };

    const enviarWhatsapp = (telefone, nome, evento_id) => {
        const nomeEvento = eventos.find(e => Number(e.id) === Number(evento_id))?.nome || 'Evento não encontrado';
        const mensagem = `Olá ${nome}, você está convidado para o evento "${nomeEvento}"! Por favor, confirme sua presença.`;
        const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
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
                            {convidados.filter(convidado => Number(convidado.evento_id) === Number(evento.id)).map(convidado => (
                                <div key={convidado.id} className="convidado-item">
                                    {editIndex === convidado.id ? (
                                        <div>
                                            <input type="text" name="nome" value={editData.nome} onChange={handleChange} />
                                            <input type="text" name="telefone" value={editData.telefone} onChange={handleChange} />
                                            <input type="email" name="email" value={editData.email} onChange={handleChange} />
                                            <input type="number" name="acompanhante" value={editData.acompanhante} onChange={handleChange} />
                                            <button onClick={handleUpdate}>Salvar</button>
                                        </div>
                                    ) : (
                                        <>
                                            <p><strong>Nome:</strong> {convidado.nome}</p>
                                            <p><strong>Telefone:</strong> {convidado.telefone}</p>
                                            <p><strong>Email:</strong> {convidado.email}</p>
                                            <p><strong>Acompanhantes:</strong> {convidado.acompanhante}</p>
                                            <div className="acoes-card">
                                                <FaEdit onClick={() => handleEdit(convidado.id)} />
                                                <FaTrash onClick={() => handleDelete(convidado.id)} />
                                                <FaWhatsapp onClick={() => enviarWhatsapp(convidado.telefone, convidado.nome, evento.id)} />
                                            </div>
                                        </>
                                    )}
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
