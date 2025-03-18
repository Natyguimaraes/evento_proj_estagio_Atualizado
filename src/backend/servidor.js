import express from "express";
import cors from "cors";
import eventoRoutes from "./rotas/eventos.js";
import adminRoutes from "./rotas/administradores.js";
import convidadoRoutes from "./rotas/convidados.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/eventos", eventoRoutes);
app.use("/api/eventos/:id", eventoRoutes)
app.use("/api/administradores", adminRoutes);
app.use("/convidados", convidadoRoutes);
app.use("/api/convidados", convidadoRoutes);
app.use("/api/convidados/:id", convidadoRoutes);
app.use("/api/convidados/:id/confirmacao", convidadoRoutes);
app.use("/api/convidados/:id/acompanhantes/:id", convidadoRoutes)
app.listen(5000, () => {
  console.log(`Servidor rodando na porta 5000`);
});
