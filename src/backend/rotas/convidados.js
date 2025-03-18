import express from "express";
import conexao from "../configuracao/banco.js"; 

import {
  getAllConvidados,
  createConvidado,
  updateConvidado,
  deleteConvidadoById,
  deleteAcompanhanteById,
  updateAcompanhanteById
} from "../controller/convidado.js";


const router = express.Router();


router.get("/", getAllConvidados);

router.delete("/acompanhantes/:id", deleteAcompanhanteById)
router.put("/acompanhantes/:id", updateAcompanhanteById)

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

router.post("/", createConvidado);

router.put("/:id", updateConvidado);

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


router.get("/api/convidados/:convidadoId/confirmacao", async (req, res) => {
  const { convidadoId } = req.params;
  const { status } = req.query;

  console.log("ID recebido:", convidadoId);
  console.log("Status recebido:", status);


  if (!convidadoId || isNaN(convidadoId)) {
    return res.status(400).json({ erro: "ID inválido." });
  }


  if (!status || (status !== "sim" && status !== "nao")) {
    return res.status(400).json({ erro: "Status inválido." });
  }

  try {

    const query = `UPDATE convidados SET confirmacao = ? WHERE id = ?`;
    const [resultado] = await conexao.query(query, [status, convidadoId]);

 
    if (resultado.affectedRows > 0) {
      res.json({ mensagem: `Presença do convidado ${convidadoId} confirmada como ${status}.` });
    } else {
      res.status(404).json({ erro: "Convidado não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao atualizar confirmação:", error);
    res.status(500).json({ erro: "Erro ao processar confirmação." });
  }
});



export default router;
