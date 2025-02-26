import express from 'express';
import cors from 'cors';

// Importação correta das rotas
import eventoRoutes from './rotas/eventos.js';
import adminRoutes from './rotas/administradores.js';
import convidadoRoutes from './rotas/convidados.js'; // Caso tenha um arquivo para convidados

const app = express();

app.use(express.json());
app.use(cors());

// Usando as rotas corretamente
app.use('/api/eventos', eventoRoutes);
app.use('/api/administradores', adminRoutes);
app.use('/api/convidados', convidadoRoutes); // Caso tenha essa rota separada

app.listen(5000, () => {
    console.log(`Servidor rodando na porta 5000`);
});
