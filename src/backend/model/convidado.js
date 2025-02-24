import banco from '../configuracao/banco.js';

class Convidado {
    static listar(callback) {
        banco.query('SELECT * FROM convidados WHERE ativo = 1', callback);
    }
    static criar(nome, telefone, email, evento_id, callback) {
        banco.query('INSERT INTO convidados (nome, telefone, email, evento_id) VALUES (?, ?, ?, ?)', [nome, telefone, email, evento_id], callback);
    }
}
export default Convidado;