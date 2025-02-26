import mysql from 'mysql2';

const banco = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'sistema_eventos',
});

class Convidado {
    static listar(callback) {
        banco.query('SELECT * FROM convidados WHERE ativo = 1', callback);
    }

    static criar(nome, telefone, email, acompanhante, evento_id, callback) {
        banco.query(
            'INSERT INTO convidados (nome, telefone, email, acompanhante, evento_id) VALUES (?, ?, ?, ?, ?)',
            [nome, telefone, email, acompanhante, evento_id],
            callback
        );
    }

    // Atualização com "confirmado"
    static atualizar(id, nome, telefone, email, acompanhante, evento_id, confirmado, callback) {
        banco.query(
            'UPDATE convidados SET nome = ?, telefone = ?, email = ?, acompanhante = ?, evento_id = ?, confirmado = ? WHERE id = ?',
            [nome, telefone, email, acompanhante, evento_id, confirmado, id], // Incluído "confirmado"
            callback
        );
    }

    static excluir(id, callback) {
        banco.query('UPDATE convidados SET ativo = 0 WHERE id = ?', [id], callback);
    }

    static obterPorId(id, callback) {
        banco.query('SELECT * FROM convidados WHERE id = ?', [id], callback);
    }
}

export default Convidado;