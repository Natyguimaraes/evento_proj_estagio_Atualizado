import express from 'express';
import Administrador from '../model/administrador.js';
const router = express.Router();

router.post('/login', (req, res) => {
    const { cpf, senha } = req.body;
    Administrador.autenticar(cpf, senha, (erro, admin) => {
        if (erro) return res.status(500).json({ erro: 'Erro no servidor' });
        if (!admin) return res.status(401).json({ erro: 'CPF ou senha inválidos' });
        res.json({ mensagem: 'Login realizado com sucesso' });
    });
});
export default router;