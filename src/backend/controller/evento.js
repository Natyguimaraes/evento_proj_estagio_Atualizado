import {
  createEvento,
  readEventos,
  readEventoPorId,
  readEventosPorAdministrador,
  updateEvento,
  deleteEvento,
} from "../model/evento.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function getAllEventos(req, res) {
  try {
    const eventos = await readEventos();


    const eventosNormalizados = eventos.map(evento => ({
      ...evento,
      imagem_evento: evento.imagem_evento ? evento.imagem_evento.replace(/\\/g, '/') : null,
    }));

    res.status(200).json(eventosNormalizados);
  } catch (err) {
    console.error("Erro ao buscar eventos:", err);
    res.status(500).json({
      error: "Erro interno ao buscar eventos."
    });
  }
}

export async function getEventoPorId(req, res) {
  const {
    id
  } = req.params;

  try {
    const evento = await readEventoPorId(id);
    res.json(evento);
  } catch (error) {
    console.error("Erro ao buscar evento:", error);

    if (error === "Evento não encontrado") {
      res.status(404).json({
        error: "Evento não encontrado."
      });
    } else {
      res.status(500).json({
        error: "Erro interno no servidor."
      });
    }
  }
}

export async function getEventosPorAdministrador(req, res) {
  const {
    administrador_id
  } = req.query;

  console.log("Recebido administrador_id:", administrador_id); // Log para depuração

  try {
    if (!administrador_id) {
      return res.status(400).json({
        error: "administrador_id é obrigatório."
      });
    }

    const eventos = await readEventosPorAdministrador(administrador_id);
    console.log("Eventos encontrados:", eventos); 
    if (!eventos || eventos.length === 0) {
      return res.status(404).json({
        error: "Nenhum evento encontrado."
      });
    }

    const eventosNormalizados = eventos.map(evento => ({
      ...evento,
      imagem_evento: evento.imagem_evento ? evento.imagem_evento.replace(/\\/g, '/') : null,
    }));

    res.json(eventosNormalizados);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);

    if (error.code === "ER_NO_SUCH_TABLE") {
      res.status(500).json({
        error: "Tabela 'eventos' não encontrada."
      });
    } else if (error.code === "ER_BAD_FIELD_ERROR") {
      res.status(500).json({
        error: "Campo 'administrador_id' não encontrado."
      });
    } else {
      res.status(500).json({
        error: "Erro interno no servidor."
      });
    }
  }
}

export async function createEventoController(req, res) {
  const {
    nome,
    descricao,
    data_evento,
    local,
    administrador_id
  } = req.body;
  const imagem_evento = req.file ? req.file.path.replace(/\\/g, '/') : null; // Normaliza o caminho da imagem

  console.log("Dados recebidos:", {
    nome,
    descricao,
    data_evento,
    local,
    administrador_id,
    imagem_evento
  });

  if (!nome || !descricao || !data_evento || !local || !administrador_id) {
    return res.status(400).json({
      error: "Todos os campos são obrigatórios."
    });
  }

  try {
    const result = await createEvento(imagem_evento, nome, descricao, data_evento, local, administrador_id);
  
    res.status(201).json({
      message: "Evento cadastrado com sucesso!",
      data: result
    });
  } catch (err) {
    console.error("Erro ao cadastrar evento:", err);
    res.status(500).json({
      error: "Erro ao cadastrar evento."
    });
  }
}

export async function updateEventoController(req, res) {
  const {
    id
  } = req.params;
  const novosDados = req.body;


  if (novosDados.imagem_evento) {
    novosDados.imagem_evento = novosDados.imagem_evento.replace(/\\/g, '/');
  }

  try {
    const result = await updateEvento(id, novosDados);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({
          error: "Nenhum evento encontrado para atualizar."
        });
    }
    res.status(200).json({
      message: "Evento atualizado com sucesso"
    });
  } catch (err) {
    console.error("Erro ao atualizar evento:", err);
    res.status(500).json({
      error: "Erro interno ao atualizar evento."
    });
  }
}

export async function deleteEventoController(req, res) {
  const {
    id
  } = req.params;

  try {
    const result = await deleteEvento(id);
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({
          error: "Evento não encontrado para exclusão."
        });
    }
    res.status(200).json({
      message: "Evento excluído com sucesso"
    });
  } catch (err) {
    console.error("Erro ao excluir evento:", err);
    res.status(500).json({
      error: "Erro interno ao excluir evento."
    });
  }
}

export async function getImagemEvento(req, res) {
  try {
    // Mantendo a rota duplicada
    const evento = await readEventoPorId(req.params.id);
    
    if (!evento || !evento.imagem_evento) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }

    const caminhoImagem = path.join(__dirname, '../../uploads', path.basename(evento.imagem_evento));
    
    // Verificação de segurança
    if (!fs.existsSync(caminhoImagem)) {
      return res.status(404).json({ error: "Arquivo de imagem não encontrado" });
    }

    // Determina o tipo MIME
    const extensao = path.extname(caminhoImagem).substring(1).toLowerCase();
    const tiposMime = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif"
    };

    if (tiposMime[extensao]) {
      res.type(tiposMime[extensao]);
      res.sendFile(caminhoImagem);
    } else {
      res.status(415).json({ error: "Tipo de imagem não suportado" });
    }
  } catch (error) {
    console.error("Erro ao buscar imagem:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}
