import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import "../css/confirmacao.css";
import Menu from "./menu";
import Rodape from "./rodape";

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [convidados, setConvidados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDados() {
      setLoading(true);
      try {
        const responseEventos = await fetch("http://localhost:5000/api/eventos");
        if (!responseEventos.ok) throw new Error("Erro ao buscar eventos");
        const dataEventos = await responseEventos.json();

        const responseConvidados = await fetch("http://localhost:5000/api/convidados");
        if (!responseConvidados.ok) throw new Error("Erro ao buscar convidados");
        const dataConvidados = await responseConvidados.json();

        setEventos(dataEventos);
        setConvidados(dataConvidados);
      } catch (error) {
        console.error("Erro ao buscar dados:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDados();
  }, []);

  const handleEventoClick = (eventoId) => {
    setEventoSelecionado(eventoId);
  };

  return (
    <>
      <Menu />
      <div className="container">
        <h1 className="titulo">Gerenciamento de Eventos</h1>
        {loading ? (
          <p className="mensagem-carregando">Carregando eventos...</p>
        ) : (
          <div className="eventos-lista">
            <h2 className="subtitulo">📅 Próximos Eventos</h2>
            {eventos.length > 0 ? (
              <div className="eventos-grid">
                {eventos.map((evento) => {
                  const convidadosEvento = convidados.filter((c) => c.evento_id === evento.id);
                  const totalConvidados = convidadosEvento.length;
                  const totalAcompanhantes = convidadosEvento.reduce((acc, c) => {
                    const acompanhante = parseInt(c.acompanhante, 10);
                    return acc + (isNaN(acompanhante) ? 0 : acompanhante);
                  }, 0);
                  
                  const totalParticipantes = totalConvidados + totalAcompanhantes;

                  return (
                    <div key={evento.id} className="evento-card" onClick={() => handleEventoClick(evento.id)}>
                      <div className="evento-header">
                        <h3 className="evento-titulo">{evento.nome}</h3>
                        <p className="evento-data">
                          📆 {format(new Date(evento.data_evento), "dd/MM/yyyy HH:mm")}
                        </p>
                      </div>
                      <p className="evento-descricao">{evento.descricao}</p>
                      <p className="evento-participantes">
                        👥 <strong>{totalParticipantes}</strong> Participantes (<strong>{totalConvidados}</strong> Convidados + <strong>{totalAcompanhantes}</strong> Acompanhantes)
                      </p>
                      {eventoSelecionado === evento.id && (
                        <div className="evento-opcoes">
                          <button onClick={() => navigate("/confirmacao")}>📊 Mais informações</button>
                          <button onClick={() => navigate("/cadastroConvidado")}>➕ Cadastrar Convidado</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mensagem-erro">🚫 Nenhum evento disponível.</p>
            )}
          </div>
        )}
      </div>
      <Rodape />
    </>
  );
}

export default Eventos;
