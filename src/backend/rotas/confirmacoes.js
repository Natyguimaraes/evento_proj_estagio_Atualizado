import express from 'express';
import Convidado from '../model/confirmacao.js'; // Importe o modelo Convidado

const router = express.Router();

// Criar um novo convidado e enviar mensagem de confirmação
router.post('/', (req, res) => { // Removido o async/await
    const { nome, email, telefone, acompanhantes, evento_id } = req.body;

    Convidado.criar(nome, telefone, email, acompanhantes, evento_id, (erro, novoConvidado) => { // Callback
        if (erro) {
            console.error('Erro ao adicionar convidado:', erro);
            return res.status(500).json({ message: 'Erro ao adicionar convidado', error: erro.message }); // Envia a mensagem de erro
        }

        const confirmacaoLink = `https://seusite.com/confirmar/${novoConvidado.id}`;
        // eslint-disable-next-line no-undef
        sendWhatsAppMessage(telefone, nome, confirmacaoLink); // Mantido (presume-se que esteja definida)

        res.status(201).json(novoConvidado);
    });
});

// Buscar todos os convidados
router.get('/', (req, res) => { // Removido o async/await
    Convidado.listar((erro, convidados) => { // Callback
        if (erro) {
            console.error('Erro ao buscar convidados:', erro);
            return res.status(500).json({ message: 'Erro ao buscar convidados', error: erro.message }); // Envia a mensagem de erro
        }
        res.json(convidados);
    });
});

// Buscar um único convidado pelo ID
router.get('/:id', (req, res) => { // Removido o async/await
    const { id } = req.params;

    Convidado.obterPorId(id, (erro, convidado) => { // Callback
        if (erro) {
            console.error('Erro ao buscar convidado:', erro);
            return res.status(500).json({ message: 'Erro ao buscar convidado', error: erro.message }); // Envia a mensagem de erro
        }

        if (!convidado) {
            return res.status(404).json({ message: 'Convidado não encontrado' });
        }

        res.json(convidado);
    });
});

// Atualizar confirmação de presença
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    const { nome, telefone, email, acompanhante, evento_id, confirmado } = req.body;

    // Validação de campos (exemplo básico)
    if (!nome || !telefone || !email || !acompanhante || !evento_id || confirmado === undefined) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    Convidado.atualizar(id, nome, telefone, email, acompanhante, evento_id, confirmado, (erro, resultado) => {
        if (erro) {
            console.error('Erro na rota PUT:', erro);
            return res.status(500).json({ message: erro.message }); // Envia a mensagem de erro do objeto erro
        }

        console.log('Resultado da atualização:', resultado);
        res.json(resultado);
    });
});

router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido' });
    }

    Convidado.excluir(id, (erro, resultado) => {
        if (erro) {
            console.error("ERRO NA ROTA DELETE:", erro);
            return res.status(500).json({ message: erro.message }); // Envia a mensagem de erro do objeto erro
        }

        console.log("Resultado da exclusão:", resultado);
        res.json(resultado);
    });
});

export default router;