import express from "express";
import conexao from "../configuracao/banco.js"; 
import {
  getAllConvidados,
  createConvidado,
  updateConvidado,
  deleteConvidadoById,
  deleteAcompanhanteById,
  updateAcompanhanteById,
  
} from "../controller/convidado.js";

const router = express.Router();

// Rota: GET /api/convidados?administrador_id=24
router.get("/", getAllConvidados);



// Rota: DELETE /api/convidados/acompanhantes/:id
router.delete("/acompanhantes/:id", deleteAcompanhanteById);

// Rota: PUT /api/convidados/acompanhantes/:id
router.put("/acompanhantes/:id", updateAcompanhanteById);

// Rota: GET /api/convidados/:id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    conexao.execute("SELECT * FROM convidados WHERE id = ?", [id], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (rows.length === 0) {
        return res.status(404).json({ error: "Convidado não encontrado" });
      }

      res.json(rows[0]);
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota: POST /api/convidados
router.post("/", createConvidado);

// Rota: PUT /api/convidados/:id
router.put("/:id", updateConvidado);

// Rota: DELETE /api/convidados/:id
router.delete("/:id", deleteConvidadoById);


router.get("/:id/confirmacao", async (req, res) => {
  const { id } = req.params;
  const { status } = req.query;

  if (!status) {
    return res.send("<h1>Erro</h1><p>Parâmetro 'status' não fornecido.</p>");
  }

  const statusLower = status.toLowerCase();
  if (!["sim", "nao"].includes(statusLower)) {
    return res.send("<h1>Erro</h1><p>O status deve ser 'sim' ou 'nao'.</p>");
  }

  const confirmado = statusLower === "sim" ? 1 : 0;

  try {
    
    conexao.execute(
      "UPDATE convidados SET confirmado = ? WHERE id = ?",
      [confirmado, id],
      (err, result) => {
        if (err) {
          console.error("Erro ao processar confirmação:", err);
          return res.status(500).json({ erro: "Erro ao processar confirmação." });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({ erro: "Convidado não encontrado." });
        }

        res.send(
          `<h1>Confirmação recebida!</h1>
           <p>Você escolheu: <strong>${confirmado ? "Vou participar" : "Não vou"}</strong>.</p>`
        );
      }
    );
  } catch (error) {
    console.error("Erro ao processar confirmação:", error);
    res.status(500).json({ erro: "Erro ao processar confirmação." });
  }
});


router.put("/api/convidados/:convidadoId/confirmacao", async (req, res) => {
  const { convidadoId } = req.params;
  const { status } = req.query;

  // Validando os parâmetros
  if (!convidadoId || isNaN(convidadoId)) {
    return res.status(400).json({ erro: "ID inválido." });
  }

  if (!status || !["sim", "nao"].includes(status)) {
    return res.status(400).json({ erro: "Status inválido. Use 'sim' ou 'nao'." });
  }

  // Convertendo 'sim' para 1 e 'nao' para 0
  const confirmado = status === "sim" ? 1 : 0;

  try {
    // Atualizando o banco de dados
    const [resultado] = await conexao.query(
      "UPDATE convidados SET confirmado = ? WHERE id = ?",
      [confirmado, convidadoId]
    );

    // Verificando se o convidado foi encontrado e atualizado
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: "Convidado não encontrado." });
    }

    // Retornando resposta de sucesso
    res.json({
      mensagem: `Confirmação recebida! O convidado ${convidadoId} ${status === "sim" ? "confirmou" : "não confirmou"} presença.`,
    });
  } catch (error) {
    console.error("Erro ao processar confirmação:", error);
    res.status(500).json({ erro: "Erro ao processar confirmação." });
  }
});

export default router;
