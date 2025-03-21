import express from "express";
import {
  createEventoController,
  getAllEventos,
  updateEventoController,
  deleteEventoController,
} from "../controller/evento.js";
import multer from "multer";
import path from "path";
import conexao from "../configuracao/banco.js"; 

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); 
    cb(null, uniqueSuffix + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });

// Rotas
router.get("/", getAllEventos); 


router.post("/", upload.single("imagem_evento"), createEventoController);

router.put("/:id", updateEventoController); 
router.delete("/:id", deleteEventoController); 


router.get("/api/eventos", async (req, res) => {
  const { administrador_id } = req.query; 

  try {
    const query = "SELECT * FROM eventos WHERE administrador_id = ?";
    const [eventos] = await conexao.execute(query, [administrador_id]);
    res.json(eventos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;