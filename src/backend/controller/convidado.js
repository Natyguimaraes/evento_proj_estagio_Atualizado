import { create, read, update, deleteConvidado, createAcompanhante } from "../model/convidado.js";

export async function createConvidado(req, res) {
  const { nome, telefone, email, acompanhante, evento_id } = req.body;

  try {

    const result = await create(nome, telefone, email, acompanhante, evento_id);
    const convidadoId = result.insertId;


    if (acompanhante.length > 0) {
      for (const acompanhante of acompanhante) {
        await createAcompanhante(acompanhante.nome, acompanhante.telefone, acompanhante.email, convidadoId);
      }
    }

    res.status(201).json({ mensagem: "Convidado e acompanhantes cadastrados com sucesso" });
  } catch (err) {
    console.error("Erro ao adicionar convidado:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}


export async function getAllConvidados(req, res) {
  read((err, convidados) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(convidados);
  });
}

export async function getConvidado(req, res) {
  const { id } = req.params;
  read(id, (err, convidado) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!convidado) {
      res.status(404).json({ error: "Convidado não encontrado" });
      return;
    }
    res.json(convidado);
  });
}

export async function updateConvidado(req, res) {
  const { id } = req.params;
  const novosDados = req.body;

  if (novosDados.status) {
    novosDados.confirmado = novosDados.status === 'sim';
  }
  
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
}

export async function deleteConvidadoById(req, res) {
  const { id } = req.params;
  console.log("ID recebido para exclusão:", id);

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
}

export { read, create, update, deleteConvidado };
