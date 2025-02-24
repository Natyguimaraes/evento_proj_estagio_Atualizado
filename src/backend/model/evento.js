import banco from '../configuracao/banco.js';

class Evento {
    static listar(callback) {
        banco.query('SELECT * FROM eventos WHERE ativo = 1', callback);
    }
    static criar(nome, descricao, data_evento, callback) {
        banco.query('INSERT INTO eventos (nome, descricao, data_evento) VALUES (?, ?, ?)', [nome, descricao, data_evento], callback);
    }
}
export default Evento;