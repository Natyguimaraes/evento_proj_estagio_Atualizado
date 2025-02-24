
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis do .env

const conexao = mysql.createConnection({
   
    host: process.env.DB_HOST || 'localhost',
    
    user: process.env.DB_USER || 'root',
  
    password: process.env.DB_PASSWORD || '123456789',
   
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
