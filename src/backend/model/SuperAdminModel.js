import banco from "../configuracao/banco.js"; // Configuração do banco de dados

// Cadastrar um novo plano
export function cadastrarPlano(nome, maxAcompanhantes) {
  return new Promise((resolve, reject) => {
    const query = "INSERT INTO planos (nome, max_acompanhantes) VALUES (?, ?)";
    banco.query(query, [nome, maxAcompanhantes], (err, results) => {
      if (err) {
        console.error("Erro ao cadastrar plano:", err);
        return reject(err);
      }
      resolve(results.insertId);
    });
  });
}

// Listar todos os planos
export function listarPlanos() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM planos";
    banco.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Liberar um administrador (associar um plano e ativar a conta)
export function liberarAdministrador(cpf, planoId) {
  return new Promise((resolve, reject) => {
    const query = "UPDATE administradores SET plano_id = ?, ativo = 1 WHERE cpf = ?";
    banco.query(query, [planoId, cpf], (err, results) => {
      if (err) return reject(err);
      resolve(results.affectedRows > 0);
    });
  });
}

// Listar todos os administradores
export function listarAdministradores() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM administradores";
    banco.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}

// Desativar um administrador
export function desativarAdministrador(id) {
  return new Promise((resolve, reject) => {
    const query = "UPDATE administradores SET ativo = 0 WHERE id = ?";
    banco.query(query, [id], (err, results) => {
      if (err) return reject(err);
      resolve(results.affectedRows > 0);
    });
  });
}

// Listar eventos criados por um administrador
export function listarEventosPorAdministrador(administradorId) {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM eventos WHERE administrador_id = ?";
    banco.query(query, [administradorId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
}