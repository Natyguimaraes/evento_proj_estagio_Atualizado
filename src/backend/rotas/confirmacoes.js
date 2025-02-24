// backend/rotas/confirmacoes.js
import express from 'express';
import Confirmacao from '../model/confirmacao.js';

const router = express.Router();

// Rota para obter o status da confirmação de um convidado
router.get('/:id', (req, res) => {
    const { id } = req.params;
    Confirmacao.obterConfirmacao(id, (erro, resultado) => {
        if (erro) return res.status(500).json({ erro: 'Erro ao buscar confirmação' });
        if (resultado.length === 0) return res.status(404).json({ erro: 'Convidado não encontrado' });
        res.json(resultado[0]);
    });
});

// Rota para confirmar ou negar presença
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { confirmado } = req.body;

    if (confirmado !== 0 && confirmado !== 1) {
        return res.status(400).json({ erro: 'Valor inválido para confirmação' });
    }

    Confirmacao.confirmarPresenca(id, confirmado, (erro) => {
        if (erro) return res.status(500).json({ erro: 'Erro ao atualizar confirmação' });
        res.json({ mensagem: 'Confirmação atualizada com sucesso' });
    });
});

export default router;
