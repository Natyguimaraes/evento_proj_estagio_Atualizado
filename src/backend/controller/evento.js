
// backend/controller/evento.js
import { createEvento, readEventos, updateEvento, deleteEvento } from '../model/evento.js';

// Obter todos os eventos
export async function getAllEventos(req, res) {
    try {
        const eventos = await readEventos(); // Agora 'readEventos' retorna uma Promise
        res.status(200).json(eventos);
    } catch (err) {
        console.error('Erro ao buscar eventos:', err);
        res.status(500).json({ error: 'Erro interno ao buscar eventos.' });
    }
}

// Função para criar um novo evento
export async function createEventoController(req, res) {
    const { nome, descricao, data_evento } = req.body;

    if (!nome || !descricao || !data_evento) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    try {
        const result = await createEvento(nome, descricao, data_evento); // Utilizando a Promise do modelo
        res.status(201).json({ mensagem: 'Evento cadastrado com sucesso', data: result });
    } catch (err) {
        console.error('Erro ao cadastrar evento:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

// Função para atualizar um evento
export async function updateEventoController(req, res) {
    const { id } = req.params;
    const novosDados = req.body;

    try {
        const result = await updateEvento(id, novosDados); // Utilizando a Promise do modelo
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Nenhum evento encontrado para atualizar.' });
        }
        res.status(200).json({ message: 'Evento atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar evento:', err);
        res.status(500).json({ error: 'Erro interno ao atualizar evento.' });
    }
}

// Função para excluir um evento
export async function deleteEventoController(req, res) {
    const { id } = req.params;

    try {
        const result = await deleteEvento(id); // Utilizando a Promise do modelo
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Evento não encontrado para exclusão.' });
        }
        res.status(200).json({ message: 'Evento excluído com sucesso' });
    } catch (err) {
        console.error('Erro ao excluir evento:', err);
        res.status(500).json({ error: 'Erro interno ao excluir evento.' });
    }
}
