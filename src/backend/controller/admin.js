import { findByCpfAndSenha, createAdmin } from "../model/administrador.js";

export async function loginAdmin(req, res) {
  const { cpf, senha } = req.body;

  if (!cpf || !senha) {
    return res.status(400).json({ message: "CPF e senha são obrigatórios" });
  }

  try {
    const admin = await findByCpfAndSenha(cpf, senha);
    if (!admin) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    res.status(200).json({ message: "Login realizado com sucesso", admin });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor", error });
  }
}

export async function registerAdmin(req, res) {
  const { nome, cpf, senha } = req.body;

  if (!nome || !cpf || !senha) {
    return res
      .status(400)
      .json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const result = await createAdmin(nome, cpf, senha);
    res
      .status(201)
      .json({
        message: "Administrador cadastrado com sucesso",
        id: result.insertId,
      });
  } catch (error) {
    res.status(500).json({ message: "Erro ao cadastrar administrador", error });
  }
}
