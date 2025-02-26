// backend/model/evento.js
// backend/model/evento.js
import conexao from '../configuracao/banco.js';

// Função para buscar todos os eventos
export function readEventos() {
    return new Promise((resolve, reject) => {
        conexao.query('SELECT * FROM eventos', (err, result) => {
            if (err) {
                console.error('Erro ao ler eventos do banco de dados:', err);
                reject('Erro ao ler eventos do banco de dados');
                return;
            }
            console.log('Eventos lidos do banco de dados:', result);
            resolve(result);
        });
    });
}

// Função para criar um novo evento
export function createEvento(nome, descricao, data_evento) {
    return new Promise((resolve, reject) => {
        conexao.query(
            'INSERT INTO eventos (nome, descricao, data_evento) VALUES (?, ?, ?)', 
            [nome, descricao, data_evento], 
            (err, result) => {
                if (err) {
                    console.error('Erro ao criar evento:', err);
                    reject('Erro ao criar evento');
                    return;
                }
                resolve({ id: result.insertId, nome, descricao, data_evento });
            }
        );
    });
}

// Função para atualizar um evento
export function updateEvento(id, novoDados) {
    return new Promise((resolve, reject) => {
        conexao.query('UPDATE eventos SET ? WHERE id = ?', [novoDados, id], (err, result) => {
            if (err) {
                console.error('Erro ao atualizar evento:', err);
                reject('Erro ao atualizar evento');
                return;
            }
            resolve(result);
        });
    });
}

// Função para deletar um evento
export function deleteEvento(id) {
    return new Promise((resolve, reject) => {
        conexao.query('DELETE FROM eventos WHERE id = ?', [id], (err, result) => {
            if (err) {
                console.error('Erro ao deletar evento:', err);
                reject('Erro ao deletar evento');
                return;
            }
            resolve(result);
        });
    });
}
