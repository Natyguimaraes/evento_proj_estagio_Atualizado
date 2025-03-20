import bcrypt from "bcrypt";
import conexao from "../configuracao/banco.js";

export function findByCpfAndSenha(cpf, senha) {
  return new Promise((resolve, reject) => {
    conexao.query(
      "SELECT * FROM administradores WHERE cpf = ? AND ativo = 1", 
      [cpf],
      async (err, results) => {
        if (err) return reject(err);
        
        if (results.length === 0) {
          return resolve(null); 
        }

        const administrador = results[0];


        const isMatch = await bcrypt.compare(senha, administrador.senha);
        if (!isMatch) {
          return resolve(null); 
        }

        resolve(administrador); 
      }
    );
  });
}

export function createAdmin(nome, cpf, senha, planoId = 1) {
  return new Promise((resolve, reject) => {
    // Criptografando a senha
    bcrypt.hash(senha, 10, (err, hashedPassword) => {
      if (err) return reject(err);

      conexao.query(
        "INSERT INTO administradores (nome, cpf, senha, plano_id) VALUES (?, ?, ?, ?)",
        [nome, cpf, hashedPassword, planoId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  });
}


export function liberarAcesso(cpf, planoId) {
  return new Promise((resolve, reject) => {
    conexao.query(
      "UPDATE administradores SET liberado = TRUE, plano_id = ? WHERE cpf = ?",
      [planoId, cpf],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
}
