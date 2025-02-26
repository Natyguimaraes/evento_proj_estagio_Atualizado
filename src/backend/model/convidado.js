import conexao from "../configuracao/banco.js";

export function read(callback) {
  conexao.query("SELECT * from convidados", (err, result) => {
    if (err) {
      console.error("Erro ao ler dados do banco de dados:", err);
      callback(err, null);
      return;
    }
    console.log("Dados lidos do banco de dados:", result);
    callback(null, result);
  });
}

export function create(nome, telefone, email, acompanhante, evento_id) {
  return new Promise((resolve, reject) => {
    conexao.query(
      "INSERT INTO convidados (nome, telefone, email, acompanhante, evento_id) VALUES (?, ?, ?, ?, ?)",
      [nome, telefone, email, acompanhante, evento_id],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      }
    );
  });
}

export function update(id, novoDados, callback) {
  conexao.query(
    "UPDATE convidados SET ? WHERE id = ?",
    [novoDados, id],
    callback
  );
}

export function deleteConvidado(id, callback) {
  conexao.query("DELETE from convidados where id = ?", [id], callback);
}
