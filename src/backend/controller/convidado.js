import { create, read, update, deleteConvidado, createAcompanhante } from "../model/convidado.js";

export async function createConvidado(req, res) {
  const { nome, telefone, email, acompanhantes, evento_id } = req.body;

  try {
    const result = await create(nome, telefone, email, evento_id);
    const convidadoId = result.insertId;

    if (acompanhantes && acompanhantes.length > 0) {
      for (const a of acompanhantes) {
        await createAcompanhante(a.nome, a.telefone, a.email, convidadoId);
      }
    }

    res.status(201).json({ mensagem: "Convidado e acompanhantes cadastrados com sucesso" });
  } catch (err) {
    console.error("Erro ao adicionar convidado:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export async function getAllConvidados(req, res) {
  try {
    const convidados = await read();
    res.json(convidados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function updateConvidado(req, res) {
  const { id } = req.params;
  const novosDados = req.body;

  try {
    const result = await update(id, novosDados);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Nenhum convidado encontrado para atualizar." });
    }
    res.status(200).json({ message: "Convidado atualizado com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function deleteConvidadoById(req, res) {
  const { id } = req.params;
  try {
    const result = await deleteConvidado(id);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Convidado não encontrado para exclusão." });
    }
    res.status(200).json({ message: "Convidado excluído com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

