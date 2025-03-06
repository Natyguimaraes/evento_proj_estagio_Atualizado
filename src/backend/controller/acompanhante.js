import { create, read, update, deleteAcompanhante } from './model/acompanhante'

export async function createAcompanhante(req, res) {
    const { nome, telefone, email } = req.body;
  console.log("Dados recebidos do frontend:", {
    nome,
    telefone,
    email,
  });
  try {
    const result = await create(
        nome,
        telefone,
        email
    );
    res.status(201)
    .json({ mensagem: "Convidado adicionado com sucesso", data: result });
  } catch (err) {
    console.error("Erro ao adicionar acompanhante", err);
  }res.status(500).json({ error: "Erro interno do servidor" });
}

export async function getAllAcompanhantes(req, res) {
    read((err, acompanhantes)) => {
        if (err) {
            res.status(500).json({error: err.message });
            return;
        }
        res.json(acompanhantes);
    
};
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

    });
    export async function deleteConvidadoById(req, res) {
        const { id } = req.params;
        console.log("ID recebido para exclusão", id);

        deleteConvidado (id, (err, result) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
           
        })
    }
}
export { read, create, update, deleteAcompanhante};