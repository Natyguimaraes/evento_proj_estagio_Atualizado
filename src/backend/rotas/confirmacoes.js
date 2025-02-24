import express from 'express';
import { PrismaClient } from '@prisma/client';
import { sendWhatsAppMessage } from '../services/whatsappService.js';

const router = express.Router();
const prisma = new PrismaClient();

// Criar um novo convidado e enviar mensagem de confirmação
router.post('/', async (req, res) => {
    try {
        const { nome, email, telefone, acompanhantes } = req.body;
        
        const novoConvidado = await prisma.convidado.create({
            data: {
                nome,
                email,
                telefone,
                status: 'pendente',
                acompanhantes
            }
        });

        const confirmacaoLink = `https://seusite.com/confirmar/${novoConvidado.id}`;
        await sendWhatsAppMessage(telefone, nome, confirmacaoLink);

        res.status(201).json(novoConvidado);
    } catch (error) {
        console.error('Erro ao adicionar convidado:', error);
        res.status(500).json({ message: 'Erro ao adicionar convidado', error });
    }
});

// Buscar todos os convidados
router.get('/', async (req, res) => {
    try {
        const convidados = await prisma.convidado.findMany();
        res.json(convidados);
    } catch (error) {
        console.error('Erro ao buscar convidados:', error);
        res.status(500).json({ message: 'Erro ao buscar convidados', error });
    }
});

// Atualizar status do convidado e acompanhantes
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, acompanhantes } = req.body;
        
        const convidadoAtualizado = await prisma.convidado.update({
            where: { id: Number(id) },
            data: { status, acompanhantes }
        });

        res.json(convidadoAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar convidado:', error);
        res.status(500).json({ message: 'Erro ao atualizar convidado', error });
    }
});

// Excluir convidado
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.convidado.delete({ where: { id: Number(id) } });
        res.json({ message: 'Convidado removido com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir convidado:', error);
        res.status(500).json({ message: 'Erro ao excluir convidado', error });
    }
});

export default router;