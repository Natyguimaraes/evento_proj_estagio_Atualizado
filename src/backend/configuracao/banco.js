// backend/configuracao/banco.js
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis do .env

const conexao = mysql.createConnection({
    // eslint-disable-next-line no-undef
    host: process.env.DB_HOST || 'localhost',
    // eslint-disable-next-line no-undef
    user: process.env.DB_USER || 'root',
    // eslint-disable-next-line no-undef
    password: process.env.DB_PASSWORD || '123456789',
    // eslint-disable-next-line no-undef
    database: process.env.DB_NAME || 'sistema_eventos'
});

conexao.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL');
});

export default conexao;
