import express from 'express';
import { read, create, update, deleteConvidado } from "../controller/convidado.js";

const router = express.Router();

router.get('/', (req, res) => {
    read((err, convidados) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(convidados);
    });
});

router.post('/', async (req, res) => {
    const { nome, telefone, email, acompanhante, evento_id } = req.body;
    try {
        const result = await create(nome, telefone, email, acompanhante, evento_id);
        res.status(201).json({ mensagem: 'Convidado adicionado com sucesso', data: result });
    } catch (err) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const novosDados = req.body;
    
    update(id, novosDados, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Nenhum convidado encontrado para atualizar.' });
            return;
        }
        res.status(200).json({ message: 'Convidado atualizado com sucesso' });
    });
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    
    deleteConvidado(id, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Convidado não encontrado para exclusão.' });
            return;
        }
        res.status(200).json({ message: 'Convidado excluído com sucesso' });
    });
});

export default router;

