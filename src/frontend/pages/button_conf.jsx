import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  
import "../../index.css";

function ButtonConf() {
  const { convidadoId } = useParams();  // Pega o id do convidado na URL
  const [mensagem, setMensagem] = useState("");

  const confirmarPresenca = async (status) => {
    const url = `http://localhost:5000/api/convidados/${convidadoId}/confirmacao?status=${status}`;
    console.log("Chamando API:", url);
  
    try {
      const response = await fetch(url, { method: "GET" });
  
      if (!response.ok) {
        throw new Error("Erro ao confirmar presença.");
      }
  
      setMensagem(status === "sim" ? "Presença confirmada! ✅" : "Você escolheu não participar. ❌");
    } catch (error) {
      setMensagem("Ocorreu um erro. Tente novamente.");
      console.error("Erro ao confirmar presença:", error);
    }
  };
  

  return (
    <div className="container">
      <h1>Confirme aqui a sua presença:</h1>
      <button onClick={() => confirmarPresenca("sim")}>Vou participar</button>
      <button onClick={() => confirmarPresenca("nao")}>Não vou participar</button>
      {mensagem && <p className="mensagem">{mensagem}</p>}
    </div>
  );
}

export default ButtonConf;
