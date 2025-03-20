import bcrypt from "bcrypt";
import conexao from "../configuracao/banco.js";

// Função para encontrar um administrador por CPF e senha
export function findByCpfAndSenha(cpf, senha) {
  return new Promise((resolve, reject) => {
    conexao.query(
      "SELECT * FROM administradores WHERE cpf = ? AND ativo = 1", // Verificando se o administrador está ativo
      [cpf],
      async (err, results) => {
        if (err) return reject(err);
        
        if (results.length === 0) {
          return resolve(null); // Nenhum administrador encontrado ou não está ativo
        }

        const administrador = results[0];

        // Comparando a senha fornecida com a senha armazenada no banco
        const isMatch = await bcrypt.compare(senha, administrador.senha);
        if (!isMatch) {
          return resolve(null); // Senha não corresponde
        }

        resolve(administrador); // Retorna o administrador se a senha corresponder e estiver ativo
      }
    );
  });
}

// Função para criar um administrador
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

// Função para liberar acesso (sem alteração necessária aqui)
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
