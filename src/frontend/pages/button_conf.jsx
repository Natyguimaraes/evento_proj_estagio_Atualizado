import { useState } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Check, X, MessageSquare, Clock, Calendar, User, MapPin } from "lucide-react";

function EventCredential() {
  const { convidadoId } = useParams();
  const [mensagem, setMensagem] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [whatsappEnviado, setWhatsappEnviado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const confirmarPresenca = async (status) => {
    setIsLoading(true);
    const url = `http://localhost:5000/api/convidados/${convidadoId}/confirmacao?status=${status}`;
    console.log("Chamando API:", url);

    try {
      const response = await fetch(url, { method: "GET" });
      if (!response.ok) {
        throw new Error("Erro ao confirmar presença.");
      }
      
      if (status === "sim") {
        setMensagem("Presença confirmada! ✅");
        gerarQRCode();
      } else {
        setMensagem("Você escolheu não participar. ❌");
      }
    } catch (error) {
      setMensagem("Ocorreu um erro. Tente novamente.");
      console.error("Erro ao confirmar presença:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const gerarQRCode = () => {
    const qrData = `https://meuevento.com/credencial/${convidadoId}`; //qr code único gerado para cada convidado
    setQrCodeUrl(qrData);
    enviarWhatsApp(qrData);
  };

  const enviarWhatsApp = async (qrData) => {
    const whatsappApiUrl = `http://localhost:5000/api/whatsapp/enviar?convidadoId=${convidadoId}&qrCode=${encodeURIComponent(qrData)}`;
    try {
      const response = await fetch(whatsappApiUrl, { method: "GET" });
      if (!response.ok) {
        throw new Error("Erro ao enviar WhatsApp.");
      }
      setWhatsappEnviado(true);
    } catch (error) {
      console.error("Erro ao enviar WhatsApp:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#CCCAC4]/20 to-[#C6978d]/20 p-4">
      <div className="max-w-md w-full border border-[#C6978d]/30 shadow-xl overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C18B39]/5 to-[#C6978d]/10 z-0 pointer-events-none"></div>
        
        <div className="relative z-10 pb-0 p-6">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-8 h-8 text-[#C18B39] mr-2" />
            <h1 className="text-3xl font-bold text-[#C18B39] tracking-tight">
              Confirmação de Presença
            </h1>
          </div>
          
          <div className="flex flex-col gap-2 text-center text-[#959FC6] mb-2">
            <p className="flex items-center justify-center gap-1">
              <User className="w-4 h-4" /> Convidado: {convidadoId}
            </p>
            <p className="flex items-center justify-center gap-1">
              <MapPin className="w-4 h-4" /> Local do Evento
            </p>
          </div>
        </div>
        
        <div className="relative z-10 pt-6 p-6">
          <div className="flex gap-4 mb-6">
            <button 
              onClick={() => confirmarPresenca("sim")}
              disabled={isLoading}
              className=" flex-1 bg-[#55835A] hover:bg-[#55835A]/90 text-white
                         shadow-md hover:shadow-lg disabled:opacity-70 rounded-lg py-2"
            >
              {isLoading ? <Clock className="w-5 h-5 animate-spin mr-2" /> : <Check className="w-5 h-5 mr-2" />}
              Vou participar
            </button>
            
            <button 
              onClick={() => confirmarPresenca("nao")}
              disabled={isLoading}
              className="text-center flex-1 bg-[#959FC6] hover:bg-[#959FC6]/90 text-white
                         shadow-md hover:shadow-lg disabled:opacity-70 rounded-lg py-2 " 
            >
              {isLoading ? <Clock className="w-4 h-5 animate-spin mr-2" /> : <X className="w-4 h-5 mr-2" />}
              Não vou participar
            </button>
          </div>
          
          {mensagem && (
            <div className={`p-5 rounded-xl mb-6 text-center animate-fade-in ${
              mensagem.includes("confirmada") 
                ? "bg-[#55835A]/10 text-[#55835A] border border-[#55835A]/20" 
                : mensagem.includes("não participar") 
                  ? "bg-[#959FC6]/10 text-[#959FC6] border border-[#959FC6]/20" 
                  : "bg-[#C18B39]/10 text-[#C18B39] border border-[#C18B39]/20"
            }`}>
              <p className="font-medium">{mensagem}</p>
            </div>
          )}
          
          {qrCodeUrl && (
            <div className="bg-gradient-to-br from-[#CCCAC4]/30 to-[#C6978d]/20 p-6 rounded-xl border border-[#C6978d]/30 animate-scale-in">
              <h2 className="text-2xl font-semibold text-[#C18B39] mb-4 text-center">
                Seu QR Code de acesso
              </h2>
              
              <div className="flex justify-center mb-5">
                <div className="bg-white p-4 rounded-xl shadow-md border border-[#C6978d]/20">
                  <QRCodeCanvas value={qrCodeUrl} size={200} className="rounded-lg" />
                </div>
              </div>
              
              {whatsappEnviado && (
                <div className="flex items-center justify-center gap-2 text-[#55835A] bg-[#55835A]/10 p-3 rounded-xl border border-[#55835A]/20">
                  <MessageSquare className="w-5 h-5" />
                  <p className="font-medium">Credencial enviada pelo WhatsApp</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventCredential;
