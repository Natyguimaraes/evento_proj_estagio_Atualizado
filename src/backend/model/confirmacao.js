import banco from '../configuracao/banco.js';

class Confirmacao {
    static confirmarPresenca(convidados_id, confirmado, callback) {
        banco.query(
            'UPDATE convidados SET confirmado = ? WHERE id = ?',
            [confirmado, convidados_id],
            callback
        );
    }

    static obterConfirmacao(convidados_id, callback) {
        banco.query(
            'SELECT confirmado FROM convidados WHERE id = ?',
            [convidados_id],
            callback
        );
    }
}

export default Confirmacao;

