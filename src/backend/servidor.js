import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import rotasAdministradores from './rotas/administradores.js';
import rotasEventos from './rotas/eventos.js';
import rotasConvidados from './rotas/convidados.js';
//import rotasConfirmacoes from './rotas/confirmacoes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());


app.use('/api/administradores', rotasAdministradores);
app.use('/api/eventos', rotasEventos);
app.use('/api/convidados', rotasConvidados);
//app.use('/api/confirmacoes', rotasConfirmacoes);


const PORTA = process.env.PORT || 5000;
app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});
