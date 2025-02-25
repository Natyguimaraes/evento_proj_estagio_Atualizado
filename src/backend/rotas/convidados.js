import express from 'express';
import Convidado from '../model/convidado.js';
const router = express.Router();

router.get('/', (req, res) => {
    Convidado.listar((erro, resultados) => {
        if (erro) return res.status(500).json({ erro: 'Erro no servidor' });
        res.json(resultados);
    });
});

router.post('/', (req, res) => {
    const { nome, telefone, email, acompanhante, evento_id } = req.body;
    Convidado.criar(nome, telefone, email, acompanhante, evento_id, (erro) => {
        if (erro) return res.status(500).json({ erro: 'Erro no servidor' });
        res.json({ mensagem: 'Convidado cadastrado com sucesso' });
    });
});
export default router;