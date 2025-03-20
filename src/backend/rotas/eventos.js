import express from "express";
import {
  createEventoController,
  getAllEventos,
  updateEventoController,
  deleteEventoController,
} from "../controller/evento.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configuração do multer para salvar arquivos na pasta "uploads"
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Pasta onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Nome único para o arquivo
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Adiciona a extensão do arquivo
  },
});

const upload = multer({ storage });

// Rotas
router.get("/", getAllEventos); // Rota para listar todos os eventos

// Rota para criar eventos com upload de imagem
router.post("/", upload.single("imagem_evento"), createEventoController);

router.put("/:id", updateEventoController); // Rota para atualizar um evento
router.delete("/:id", deleteEventoController); // Rota para deletar um evento

export default router;