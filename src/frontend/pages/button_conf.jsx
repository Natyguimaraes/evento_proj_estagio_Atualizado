import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, AlertCircle } from "lucide-react";
import "../../index.css";
import PropTypes from "prop-types";

// Componente de confirmação de status
const ConfirmationSuccess = ({ status, message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="glass-card rounded-2xl p-8 text-center"
    >
      <div className="mb-6">
        {status === "success" && (
          <div className="mx-auto w-20 h-20 bg-event-green/10 rounded-full flex items-center justify-center">
            <Check className="h-10 w-10 text-event-green" />
          </div>
        )}
        {status === "declined" && (
          <div className="mx-auto w-20 h-20 bg-event-rose/10 rounded-full flex items-center justify-center">
            <X className="h-10 w-10 text-event-rose" />
          </div>
        )}
        {status === "error" && (
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-destructive" />
          </div>
        )}
      </div>
      
      <h2 className="text-2xl font-medium mb-2 text-event-dark">
        {status === "success" ? "Confirmado!" : 
         status === "declined" ? "Resposta Recebida" : "Erro"}
      </h2>
      
      <p className="text-event-dark/70 mb-4">{message}</p>
      
      {status === "success" && (
        <p className="text-sm text-event-green animate-pulse-soft">
          Sua credencial está sendo gerada...
        </p>
      )}
    </motion.div>
  );
};

// Definição de tipos para JSX
ConfirmationSuccess.propTypes = {
  status: PropTypes.oneOf(["success", "declined", "error"]).isRequired,
  message: PropTypes.string.isRequired,
};

const ButtonConf = () => {
  const { convidadoId } = useParams();
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState("idle");

  const confirmarPresenca = async (confirmStatus) => {
    const url = `http://localhost:5000/api/convidados/${convidadoId}/confirmacao?status=${confirmStatus}`;
    console.log("Chamando API:", url);
  
    try {
      // Simulando chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
  
      if (confirmStatus === "sim") {
        setMensagem("Presença confirmada!");
        setStatus("success");
      } else {
        setMensagem("Agradecemos sua resposta.");
        setStatus("declined");
      }
    } catch (error) {
      setMensagem("Ocorreu um erro. Tente novamente.");
      setStatus("error");
      console.error("Erro ao confirmar presença:", error);
    }
  };

  return (
    <div className="container">
      {status === "idle" ? (
        <div className="glass-card rounded-2xl p-8 text-center">
          <h1>Confirme aqui a sua presença:</h1>
          <button onClick={() => confirmarPresenca("sim")}>Vou participar</button>
          <button onClick={() => confirmarPresenca("nao")}>Não vou participar</button>
        </div>
      ) : (
        <ConfirmationSuccess status={status} message={mensagem} />
      )}
    </div>
  );
};

export default ButtonConf;
