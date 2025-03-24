import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  Users,
  BarChart3,
  PlusCircle,
  Loader2,
} from "lucide-react";
import Menu from "./menu";
import { toast } from "sonner";

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [convidados, setConvidados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [error, setError] = useState(null); // Estado para mensagens de erro
  const navigate = useNavigate();

  const textoCarregando = "Carregando eventos...";

  useEffect(() => {
    async function fetchDados() {
        setLoading(true);
        setError(null); // Limpa o estado de erro antes de fazer a requisição

        try {
            const adminId = localStorage.getItem("adminId");
            console.log("adminId:", adminId); // Log para depuração

            if (!adminId) {
                console.error("Erro: ID do administrador não encontrado.");
                throw new Error("ID do administrador não encontrado.");
            }

            const [eventosRes, convidadosRes] = await Promise.all([
                fetch(`http://localhost:5000/api/eventos/por-administrador?administrador_id=${adminId}`),
                fetch(`http://localhost:5000/api/convidados?administrador_id=${adminId}`),
            ]);
            

            console.log("Resposta da API de eventos:", eventosRes); // Log para depuração
            console.log("Resposta da API de convidados:", convidadosRes); // Log para depuração

            if (!eventosRes.ok || !convidadosRes.ok) {
                console.error("Erro ao buscar dados:", eventosRes.status, convidadosRes.status);
                throw new Error("Erro ao buscar dados");
            }

            if (eventosRes.status === 204) {
                setEventos([]); // Limpa a lista de eventos
                setError("Nenhum evento encontrado para este administrador.");
            } else {
                const eventosData = await eventosRes.json();
                setEventos(eventosData);
            }

            const convidadosData = await convidadosRes.json();
            setConvidados(convidadosData);
        } catch (error) {
            console.error("Erro ao buscar dados:", error); // Log para depuração
            setError("Erro ao carregar os dados. Tente novamente mais tarde.");
            toast.error(`Erro ao buscar dados: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }

    fetchDados();
}, []);

  const handleEventoClick = (eventoId) => {
    try {
      console.log("Evento selecionado:", eventoId); // Log para depuração
      setEventoSelecionado(eventoId);
    } catch (error) {
      console.error("Erro ao selecionar evento:", error); // Log para depuração
    }
  };

  return (
    <>
      <Menu className="fixed top-0 left-0 w-full z-50" />
      <div className="min-h-screen bg-gradient-to-b from-event-background to-event-accent/10 py-12 px-4 sm:px-6 lg:px-8 page-transition pt-20 z-0">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="event-chip bg-event-primary/10 text-event-primary mb-3">
              Sistema de Gestão
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-event-text-primary mb-2">
              Gerenciamento de Eventos
            </h1>
            <p className="text-event-text-secondary max-w-2xl mx-auto">
              Organize e acompanhe todos os seus eventos e participantes em um
              só lugar
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 rounded-xl p-6 text-center mb-6">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 space-y-4">
              <Loader2 className="h-10 w-10 text-event-primary animate-spin" />
              <p className="text-event-text-secondary">{textoCarregando}</p>
            </div>
          ) : (
            <div className="bg-white/50 rounded-3xl shadow-xl border border-[#bec2c7] overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex items-center mb-6">
                  <CalendarIcon className="h-5 w-5 text-event-primary mr-2" />
                  <h2 className="text-xl font-semibold text-event-text-primary">
                    Próximos Eventos
                  </h2>
                </div>

                {eventos.length > 0 ? (
                  <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventos.map((evento) => {
                      const convidadosEvento = convidados.filter(
                        (c) => c.evento_id === evento.id
                      );
                      const totalConvidados = convidadosEvento.length;
                      const totalAcompanhantes = convidadosEvento.reduce(
                        (acc, c) => acc + (c.acompanhantes?.length || 0),
                        0
                      );
                      const totalParticipantes =
                        totalConvidados + totalAcompanhantes;

                      return (
                        <div
                          key={evento.id}
                          className="bg-event-card rounded-2xl shadow-sm border border-neutral-300 p-6 transition-all duration-300 hover:shadow-md animate-fade-in"
                          style={{ animationDelay: `${evento.id * 100}ms` }}
                        >
                          <div
                            className="cursor-pointer group"
                            onClick={() => handleEventoClick(evento.id)}
                          >
                            <div className="mb-4">
                              <div className="flex justify-between items-start mb-2">
                                <div
                                  className="event-chip bg-event-accent text-event-text-accent rounded-lg p-1"
                                  style={{
                                    backgroundColor: "rgb(195 226 230)",
                                    color: "rgb(0 119 255)",
                                  }}
                                >
                                  {format(
                                    new Date(evento.data_evento),
                                    "dd MMM, yyyy"
                                  )}
                                </div>
                                <div
                                  className="event-chip rounded-lg p-1"
                                  style={{
                                    backgroundColor: "#8caf7e1a",
                                    color: "rgb(140 175 126)",
                                  }}
                                >
                                  {totalParticipantes} participantes
                                </div>
                              </div>

                              <h3 className="text-xl font-semibold text-event-text-primary group-hover:text-event-primary transition-colors">
                                {evento.nome}
                              </h3>
                            </div>

                            <div className="mb-4">
                              <p className="text-event-text-secondary text-sm">
                                {evento.descricao}
                              </p>
                            </div>

                            <div className="flex items-center text-event-text-secondary text-sm">
                              <CalendarIcon className="h-4 w-4 mr-1" />
                              <span>
                                {format(new Date(evento.data_evento), "HH:mm")}
                              </span>

                              <div className="mx-2 h-1 w-1 rounded-full bg-event-text-secondary/30"></div>

                              <Users className="h-4 w-4 mr-1" />
                              <span>{totalConvidados} convidados</span>
                            </div>
                          </div>

                          {eventoSelecionado === evento.id && (
                            <div className="mt-5 pt-5 border-t border-neutral-100 grid grid-cols-2 gap-3 animate-fade-in">
                              <button
                                className="bg-[rgb(255,157,66)] text-white font-medium py-2.5 px-4 rounded-full transition-all duration-200 hover:bg-[rgb(255,140,36)] active:bg-[rgb(255,120,20)] active:scale-95 shadow-sm inline-flex items-center justify-center"
                                onClick={() => navigate("/confirmacao")}
                              >
                                <BarChart3 className="h-4 w-4 mr-2" />
                                <span>Detalhes</span>
                              </button>
                              <button
                                className="bg-[rgb(135,167,188)] text-white font-medium py-2.5 px-4 rounded-full transition-all duration-200 hover:bg-[rgb(120,150,170)] active:bg-[rgb(110,140,155)] active:scale-95 shadow-sm inline-flex items-center justify-center"
                                onClick={() => navigate("/cadastroConvidado")}
                              >
                                <PlusCircle className="h-4 w-4 mr-2" />
                                <span>Adicionar</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-red-50 text-red-600 rounded-xl p-6 text-center">
                    <p className="font-medium">
                      Nenhum evento disponível no momento
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Eventos;