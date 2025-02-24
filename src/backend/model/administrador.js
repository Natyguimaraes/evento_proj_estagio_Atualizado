import banco from '../configuracao/banco.js';

class Administrador {
    static autenticar(cpf, senha, callback) {
        banco.query('SELECT * FROM administradores WHERE cpf = ? AND senha = ?', [cpf, senha], (erro, resultados) => {
            if (erro) callback(erro, null);
            else callback(null, resultados[0]);
        });
    }
}
export default Administrador;