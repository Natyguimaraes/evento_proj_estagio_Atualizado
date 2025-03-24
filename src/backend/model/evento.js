import conexao from "../configuracao/banco.js";

export function readEventos() {
  return new Promise((resolve, reject) => {
    conexao.query("SELECT * FROM eventos", (err, result) => {
      if (err) {
        console.error("Erro ao ler eventos do banco de dados:", err);
        reject("Erro ao ler eventos do banco de dados");
        return;
      }
      console.log("Eventos lidos do banco de dados:", result);
      resolve(result);
    });
  });
}

export function readEventoPorId(id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM eventos WHERE id = ?";
    conexao.query(query, [id], (err, result) => {
      if (err) {
        console.error("Erro ao buscar evento:", err);
        reject("Erro ao buscar evento no banco de dados");
        return;
      }

      if (result.length === 0) {
        reject("Evento não encontrado");
        return;
      }

      resolve(result[0]); // Retorna o primeiro evento encontrado
    });
  });
}

export function readEventosPorAdministrador(administrador_id) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM eventos WHERE administrador_id = ?";
    conexao.query(query, [administrador_id], (err, result) => {
      if (err) {
        console.error("Erro ao ler eventos do banco de dados:", err);
        reject("Erro ao ler eventos do banco de dados");
        return;
      }
      console.log("Eventos lidos do banco de dados:", result);
      resolve(result);
    });
  });
}
export function createEvento(imagem_evento, nome, descricao, data_evento, local, administrador_id) {
  return new Promise((resolve, reject) => {
    conexao.query(
      "INSERT INTO eventos (imagem_evento, nome, descricao, data_evento, local, administrador_id) VALUES (?, ?, ?, ?, ?, ?)",
      [imagem_evento, nome, descricao, data_evento, local, administrador_id],
      (err, result) => {
        if (err) {
          console.error("Erro ao criar evento:", err);
          reject("Erro ao criar evento");
          return;
        }
        resolve({ id: result.insertId, imagem_evento, nome, descricao, data_evento, local, administrador_id });
      }
    );
  });
}

export function updateEvento(id, novoDados) {
  return new Promise((resolve, reject) => {
    conexao.query(
      "UPDATE eventos SET ? WHERE id = ?",
      [novoDados, id],
      (err, result) => {
        if (err) {
          console.error("Erro ao atualizar evento:", err);
          reject("Erro ao atualizar evento");
          return;
        }
        resolve(result);
      }
    );
  });
}

export function deleteEvento(id) {
  return new Promise((resolve, reject) => {
    conexao.query("DELETE FROM eventos WHERE id = ?", [id], (err, result) => {
      if (err) {
        console.error("Erro ao deletar evento:", err);
        reject("Erro ao deletar evento");
        return;
      }
      resolve(result);
    });
  });
}
