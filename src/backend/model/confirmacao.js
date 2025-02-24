// backend/modelos/Confirmacao.js
import banco from '../configuracao/banco.js';

class Confirmacao {
    static confirmarPresenca(convidado_id, confirmado, callback) {
        banco.query(
            'UPDATE convidados SET confirmado = ? WHERE id = ?',
            [confirmado, convidado_id],
            callback
        );
    }

    static obterConfirmacao(convidado_id, callback) {
        banco.query(
            'SELECT confirmado FROM convidados WHERE id = ?',
            [convidado_id],
            callback
        );
    }
}

export default Confirmacao;
