// backend/rotas/eventos.js
import express from 'express';
import {
    createEventoController,
    getAllEventos,
    updateEventoController,
    deleteEventoController
} from '../controller/evento.js';

const router = express.Router();

// Rota para obter todos os eventos
router.get('/', getAllEventos);

// Rota para cadastrar um novo evento
router.post('/', createEventoController);

// Rota para atualizar um evento
router.put('/:id', updateEventoController);

// Rota para excluir um evento
router.delete('/:id', deleteEventoController);

export default router;
