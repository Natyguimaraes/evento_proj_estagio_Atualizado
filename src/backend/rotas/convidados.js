import express from "express";
import {
  getAllConvidados,
  createConvidado,
  updateConvidado,
  deleteConvidadoById,
} from "../controller/convidado.js";

const router = express.Router();

// Rota para obter todos os convidados
router.get("/", getAllConvidados);

// Rota para obter um convidado específico
router.get("/:id", async (req, res) => {
  try {
    const convidados = await getAllConvidados();
    const convidado = convidados.find((c) => c.id == req.params.id);

    if (!convidado) {
      return res.status(404).json({ error: "Convidado não encontrado" });
    }
    res.json(convidado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para adicionar um novo convidado
router.post("/", createConvidado);

// Rota para atualizar um convidado
router.put("/:id", updateConvidado);

// Rota para excluir um convidado
router.delete("/:id", deleteConvidadoById);

// Rota para confirmação de presença
router.get("/:id/confirmacao", async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;

  if (!status) {
    return res.status(400).json({ erro: "Parâmetro 'status' não fornecido." });
  }

  try {
    const confirmado = status === "sim";
    const result = await updateConvidado({ params: { id }, body: { confirmado } });

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Convidado não encontrado." });
    }

    res.send(
      `<h1>Confirmação recebida!</h1><p>Você escolheu: <strong>${confirmado ? "Vou participar" : "Não vou"}</strong>.</p>`
    );
  } catch (error) {
    console.error("Erro ao processar confirmação:", error);
    res.status(500).json({ erro: "Erro ao processar confirmação." });
  }
});

export default router;
