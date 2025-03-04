import React, { useState, useEffect } from "react";
import { format } from 'date-fns'; // Importa a função para formatar a data
import "../css/confirmacao.css"; // Verifique se o Tailwind CSS está sendo importado corretamente

function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDados() {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/eventos");
        if (!response.ok) throw new Error("Erro ao buscar eventos");

        const data = await response.json();
        
        // Verifique o formato da resposta da API
        console.log("Dados recebidos da API:", data);

        // Verifique se o dado recebido é um array de objetos
        if (Array.isArray(data)) {
          const eventosFormatados = data.map((evento) => {
            const dataEvento = new Date(evento.data_evento);
            if (isNaN(dataEvento.getTime())) {
              return null;
            }

            return {
              id: evento.id,
              title: evento.nome,
              start: dataEvento.toISOString(), // Formato ISO 8601
              description: evento.descricao,
              totalParticipantes: evento.totalParticipantes,
            };
          }).filter(evento => evento !== null); // Remove eventos inválidos

          setEventos(eventosFormatados);
        } else {
          console.error("A resposta da API não é um array de eventos!");
        }
      } catch (error) {
        console.error("Erro ao buscar eventos:", error.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDados();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Gerenciamento de Eventos</h1>

      {loading ? (
        <p className="text-center text-xl text-red-500">Carregando...</p>
      ) : (
        <div className="eventos-lista">
          <h2 className="text-2xl font-semibold mb-4 text-green-500">Lista de Eventos</h2>
          {eventos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {eventos.map((evento) => (
                <div key={evento.id} className="bg-yellow-100 p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{evento.title}</h3>
                  <p className="text-gray-700 mb-3">{evento.description}</p>
                  <p className="text-gray-500 mb-3">
                    <strong>Data:</strong> {format(new Date(evento.start), 'dd/MM/yyyy HH:mm')}
                  </p>
                  <p className="text-gray-500">
                    <strong>Total de Convidados e Acompanhantes:</strong> {evento.totalParticipantes}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg text-red-500">Nenhum evento disponível.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Eventos;




