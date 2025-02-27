import express from "express";
import {
  read,
  create,
  update,
  deleteConvidado,
} from "../controller/convidado.js";

const router = express.Router();

// Rota para obter todos os convidados
router.get("/", (req, res) => {
  read((err, convidados) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(convidados);
  });
});

// Rota para obter um convidado específico
router.get("/:id", (req, res) => {
  const { id } = req.params;

  read((err, convidados) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const convidado = convidados.find((c) => c.id == id);

    if (!convidado) {
      res.status(404).json({ error: "Convidado não encontrado" });
      return;
    }

    res.json(convidado);
  });
});

// Rota para adicionar um novo convidado
router.post("/", async (req, res) => {
  const { nome, telefone, email, acompanhante, evento_id } = req.body;
  try {
    const result = await create(nome, telefone, email, acompanhante, evento_id);
    res
      .status(201)
      .json({ mensagem: "Convidado adicionado com sucesso", data: result });
  } catch (err) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota para atualizar um convidado
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const novosDados = req.body;

  console.log("Recebendo atualização para o ID:", id);
  console.log("Novos dados recebidos:", novosDados);

  update(id, novosDados, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res
        .status(404)
        .json({ error: "Nenhum convidado encontrado para atualizar." });
      return;
    }
    res.status(200).json({ message: "Convidado atualizado com sucesso" });
  });
});

// Rota para excluir um convidado
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  deleteConvidado(id, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res
        .status(404)
        .json({ error: "Convidado não encontrado para exclusão." });
      return;
    }
    res.status(200).json({ message: "Convidado excluído com sucesso" });
  });
});

// Nova Rota para Atualizar a Confirmação de Presença
// A URL deve ser algo como: /api/convidados/1/confirmacao?status=sim
router.get("/:id/confirmacao", async (req, res) => {
  const { id } = req.params; // Obtém o ID do convidado
  const { status } = req.query; // Obtém o status do parâmetro de consulta

  // Verifica se o status foi fornecido
  if (!status) {
    return res.status(400).json({ erro: "Parâmetro 'status' não fornecido." });
  }

  try {
    const confirmado = status === "sim"; // Define se o convidado confirmou presença

    // Atualiza a confirmação no banco de dados
    const result = await new Promise((resolve, reject) => {
      update(id, { confirmado }, (err, result) => {
        if (err) {
          return reject(err);
        }
        resolve(result);
      });
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Convidado não encontrado." });
    }

    // Responde com uma mensagem de confirmação
    res.send(
      `<h1>Confirmação recebida!</h1><p>Você escolheu: <strong>${confirmado ? "Vou participar" : "Não vou"}</strong>.</p>`
    );
  } catch (error) {
    console.error("Erro ao processar confirmação:", error);
    res.status(500).json({ erro: "Erro ao processar confirmação." });
  }
});


export default router;

