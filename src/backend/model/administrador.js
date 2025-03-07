import conexao from "../configuracao/banco.js";

export function findByCpfAndSenha(cpf, senha) {
  return new Promise((resolve, reject) => {
    conexao.query(
      "SELECT * FROM administradores WHERE cpf = ? AND senha = ?",
      [cpf, senha],
      (err, results) => {
        if (err) return reject(err);
        resolve(results[0] || null);
      }
    );
  });
}

export function createAdmin(nome, cpf, senha) {
  return new Promise((resolve, reject) => {
    conexao.query(
      "INSERT INTO administradores (nome, cpf, senha) VALUES (?, ?, ?)",
      [nome, cpf, senha],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}



