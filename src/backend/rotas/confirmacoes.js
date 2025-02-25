import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();

// Criar um novo convidado e enviar mensagem de confirmação
router.post('/', async (req, res) => {
    try {
        const { nome, email, telefone, acompanhantes, evento_id } = req.body;
        
        const novoConvidado = await prisma.convidado.create({
            data: {
                nome,
                email,
                telefone,
                status: 'pendente',
                acompanhantes,
                evento_id,
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

// Buscar um único convidado pelo ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const convidado = await prisma.convidado.findUnique({ where: { id: Number(id) } });

        if (!convidado) {
            return res.status(404).json({ message: 'Convidado não encontrado' });
        }

        res.json(convidado);
    } catch (error) {
        console.error('Erro ao buscar convidado:', error);
        res.status(500).json({ message: 'Erro ao buscar convidado', error });
    }
});

// Atualizar confirmação de presença
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { confirmado, acompanhantes } = req.body;
        
        const convidadoExistente = await prisma.convidado.findUnique({ where: { id: Number(id) } });
        if (!convidadoExistente) {
            return res.status(404).json({ message: 'Convidado não encontrado' });
        }

        const convidadoAtualizado = await prisma.convidado.update({
            where: { id: Number(id) },
            data: { confirmado, acompanhantes },
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
        const convidadoExistente = await prisma.convidado.findUnique({ where: { id: Number(id) } });
        if (!convidadoExistente) {
            return res.status(404).json({ message: 'Convidado não encontrado' });
        }

        await prisma.convidado.delete({ where: { id: Number(id) } });
        res.json({ message: 'Convidado removido com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir convidado:', error);
        res.status(500).json({ message: 'Erro ao excluir convidado', error });
    }
});

export default router;
