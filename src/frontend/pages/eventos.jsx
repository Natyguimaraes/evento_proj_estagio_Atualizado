import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import "../css/confirmacao.css"; 
import Menu from "./menu";
import Rodape from "./rodape"

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [convidados, setConvidados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDados() {
      setLoading(true);
      try {
        // Buscar eventos
        const responseEventos = await fetch("http://localhost:5000/api/eventos");
        if (!responseEventos.ok) throw new Error("Erro ao buscar eventos");
        const dataEventos = await responseEventos.json();

        // Buscar convidados
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

  return (
    <><div>
      <Menu />
    </div>
    <div className="container">
        <h1 className="titulo">Gerenciamento de Eventos</h1>
        {loading ? (
          <p className="mensagem-carregando">Carregando...</p>
        ) : (
          <div className="eventos-lista">
            <h2 className="subtitulo">Lista de Eventos</h2>
            {eventos.length > 0 ? (
              <div className="eventos-grid">
                {eventos.map((evento) => {
                  // Filtrar os convidados do evento
                  const convidadosEvento = convidados.filter((c) => c.evento_id === evento.id);
                  const totalConvidados = convidadosEvento.length;
                  const totalAcompanhantes = convidadosEvento.reduce(
                    (acc, c) => acc + (Number(c.acompanhante) || 0),
                    0
                  );
                  const totalParticipantes = totalConvidados + totalAcompanhantes;

                  return (
                    <>

                      <div key={evento.id} className="evento-card">
                        <h3 className="evento-titulo">{evento.nome}</h3>
                        <p className="evento-descricao">{evento.descricao}</p>
                        <p className="evento-data">
                          <strong>Data:</strong> {format(new Date(evento.data_evento), "dd/MM/yyyy HH:mm")}
                        </p>
                        <p className="evento-participantes">
                          <strong>Total de Convidados e Acompanhantes:</strong> {totalParticipantes}
                        </p>
                      </div>
                    </>
                  );
                })}
              </div>
            ) : (
              <p className="mensagem-erro">Nenhum evento disponível.</p>
            )}
          </div>
        )}
      </div>
      <Rodape />
      </>
  );
}

export default Eventos;
