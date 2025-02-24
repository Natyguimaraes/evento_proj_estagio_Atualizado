import express from 'express';
import Evento from '../model/evento.js';
const router = express.Router();

router.get('/', (req, res) => {
    Evento.listar((erro, resultados) => {
        if (erro) return res.status(500).json({ erro: 'Erro no servidor' });
        res.json(resultados);
    });
});

router.post('/', (req, res) => {
    const { nome, descricao, data_evento } = req.body;
    Evento.criar(nome, descricao, data_evento, (erro) => {
        if (erro) return res.status(500).json({ erro: 'Erro no servidor' });
        res.json({ mensagem: 'Evento criado com sucesso' });
    });
});
export default router;