import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Check, X, MessageSquare, Clock, Calendar, User, MapPin } from "lucide-react";

function EventCredential() {
  const { convidadoId } = useParams();
  const [evento, setEvento] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [whatsappEnviado, setWhatsappEnviado] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const buscarEvento = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/eventos/${convidadoId}`);
        if (!response.ok) throw new Error("Erro ao carregar evento.");

        const data = await response.json();
        console.log("Dados do evento recebidos:", data);

        if (data.length > 0) {
          setEvento(data[0]); // Pegamos o primeiro item do array
        } else {
          console.error("Nenhum evento encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar evento:", error);
      }
    };

    buscarEvento();
  }, [convidadoId]);

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
    const qrData = `https://meuevento.com/credencial/${convidadoId}`;
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F4F4F9]/30 to-[#B6D4E6]/30 p-6">
      <div className="max-w-md w-full border border-[#D0D9E3] shadow-xl overflow-hidden bg-white/90 backdrop-blur-sm rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#D0D9E3]/10 to-[#B6D4E6]/10 z-0 pointer-events-none"></div>

        {evento && (
          <>
            {/* Imagem estática substituída pela URL fornecida */}
            <img
              src="https://cdn0.casamentos.com.br/vendor/8146/3_2/960/jpg/reserva-eventos-casamento-no-jardim-rj2_13_158146.jpeg"
              alt="Imagem do Evento"
              className="w-full h-40 object-cover rounded-t-2xl"
            />
            <div className="relative z-10 p-6">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-8 h-8 text-[#6D7C9D] mr-2" />
                <h1 className="text-3xl font-semibold text-[#6D7C9D] tracking-tight">
                  {evento.nome || "Nome não disponível"}
                </h1>
              </div>
              <p className="text-center text-[#A7B6D5]">
                {evento.descricao || "Descrição não disponível"}
              </p>

              <p className="flex items-center justify-center gap-1 text-[#B0C4D4]">
                <MapPin className="w-4 h-4" />
                {evento.local || "Local não informado"}
              </p>

              <p className="flex items-center justify-center gap-1 text-[#B0C4D4]">
                <Clock className="w-4 h-4" />
                {evento.data_evento
                  ? new Date(evento.data_evento).toLocaleString("pt-BR")
                  : "Data não disponível"}
              </p>
            </div>
          </>
        )}

        <div className="relative z-10 pt-6 p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => confirmarPresenca("sim")}
              disabled={isLoading}
              className="flex-1 bg-[#6D9F6A] hover:bg-[#6D9F6A]/90 text-white shadow-md hover:shadow-lg disabled:opacity-70 rounded-lg py-2"
            >
              {isLoading ? <Clock className="w-5 h-5 animate-spin mr-2" /> : <Check className="w-5 h-5 mr-2" />}
              Vou participar
            </button>

            <button
              onClick={() => confirmarPresenca("nao")}
              disabled={isLoading}
              className="text-center flex-1 bg-[#A7B6D5] hover:bg-[#A7B6D5]/90 text-white shadow-md hover:shadow-lg disabled:opacity-70 rounded-lg py-2"
            >
              {isLoading ? <Clock className="w-4 h-5 animate-spin mr-2" /> : <X className="w-4 h-5 mr-2" />}
              Não vou participar
            </button>
          </div>

          {mensagem && (
            <div
              className={`p-5 rounded-xl mb-6 text-center animate-fade-in ${
                mensagem.includes("confirmada")
                  ? "bg-[#6D9F6A]/10 text-[#6D9F6A] border border-[#6D9F6A]/20"
                  : mensagem.includes("não participar")
                  ? "bg-[#A7B6D5]/10 text-[#A7B6D5] border border-[#A7B6D5]/20"
                  : "bg-[#F4A261]/10 text-[#F4A261] border border-[#F4A261]/20"
              }`}
            >
              <p className="font-medium">{mensagem}</p>
            </div>
          )}

          {qrCodeUrl && (
            <div className="bg-gradient-to-br from-[#F4F4F9]/30 to-[#B6D4E6]/20 p-6 rounded-xl border border-[#D0D9E3]/30 animate-scale-in">
              <h2 className="text-2xl font-semibold text-[#6D9F6A] mb-4 text-center">
                Seu QR Code de acesso
              </h2>

              <div className="flex justify-center mb-5">
                <div className="bg-white p-4 rounded-xl shadow-md border border-[#D0D9E3]/20">
                  <QRCodeCanvas value={qrCodeUrl} size={200} className="rounded-lg" />
                </div>
              </div>

              {whatsappEnviado && (
                <div className="flex items-center justify-center gap-2 text-[#6D9F6A] bg-[#6D9F6A]/10 p-3 rounded-xl border border-[#6D9F6A]/20">
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
