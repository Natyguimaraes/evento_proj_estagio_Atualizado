import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaWhatsapp } from "react-icons/fa";

import "../css/confirmacao.css";

function Confirmacao() {
  const [eventos, setEventos] = useState([]);
  const [convidados, setConvidados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({
    nome: "",
    telefone: "",
    email: "",
    acompanhante: "",
  });

  useEffect(() => {
    async function fetchDados() {
      setLoading(true);
      try {
        const eventosResponse = await fetch(
          "http://localhost:5000/api/eventos"
        );
        if (!eventosResponse.ok) throw new Error("Erro ao buscar eventos");
        const eventosData = await eventosResponse.json();
        setEventos(eventosData);

        const convidadosResponse = await fetch(
          "http://localhost:5000/api/convidados"
        );
        if (!convidadosResponse.ok)
          throw new Error("Erro ao buscar convidados");
        const convidadosData = await convidadosResponse.json();
        setConvidados(convidadosData);
      } catch (error) {
        console.error("Erro ao buscar dados:", error.message);
        alert(`Erro ao buscar dados: ${error.message}.`);
      } finally {
        setLoading(false);
      }
    }
    fetchDados();
  }, []);

  const handleEdit = (id) => {
    const convidado = convidados.find((c) => c.id === id);
    if (!convidado) {
      console.error("Convidado não encontrado");
      return;
    }
    setEditIndex(id);
    setEditData({
      nome: convidado.nome || "",
      telefone: convidado.telefone || "",
      email: convidado.email || "",
      acompanhante: convidado.acompanhante || 0,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!editIndex) {
      alert("Erro: Nenhum convidado selecionado para edição.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/convidados/${editIndex}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar convidado");
      }
      const updatedConvidadosResponse = await fetch(
        "http://localhost:5000/api/convidados"
      );
      const updatedConvidados = await updatedConvidadosResponse.json();
      setConvidados(updatedConvidados);

      setEditIndex(null);
      alert("Convidado atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar convidado:", error);
      alert(`Erro ao atualizar convidado: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este convidado?")) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/convidados/${id}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error("Erro ao excluir convidado");
        setConvidados((prev) => prev.filter((c) => c.id !== id));
        alert("Convidado excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir convidado:", error.message);
        alert(`Erro ao excluir convidado: ${error.message}.`);
      }
    }
  };

  const enviarWhatsapp = (telefone, nome, evento_id, id) => {
    const nomeEvento = eventos.find((e) => e.id === evento_id)?.nome || "Evento";
    const linkConfirmacaoSim = `http://localhost:5000/api/convidados/${id}/confirmacao?status=sim`;
    const linkConfirmacaoNao = `http://localhost:5000/api/convidados/${id}/confirmacao?status=nao`;

  
    const mensagem = `Olá ${nome}! Você está convidado para o evento *"${nomeEvento}"*!
  
  Por favor, confirme sua presença:
  
  *Vou participar:* [Clique aqui](${linkConfirmacaoSim})
  
  *Não vou* [Clique aqui](${linkConfirmacaoNao})
  
  Esperamos por você!`;
  
    window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`, "_blank");
  };
  

  return (
    <div className="confirmacao-container">
      <h1>Lista de Convidados por Evento</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        eventos.map((evento) => {
          const convidadosEvento = convidados.filter(
            (c) => c.evento_id === evento.id
          );
          const totalConvidados = convidadosEvento.length;
          const totalAcompanhantes = convidadosEvento.reduce(
            (acc, c) => acc + (Number(c.acompanhante) || 0),
            0
          );
          const totalParticipantes = totalConvidados + totalAcompanhantes;

          const confirmados = convidadosEvento.filter(
            (c) => c.confirmado
          ).length;
          const pendentes = convidadosEvento.filter(
            (c) => c.confirmado === false
          ).length;

          return (
            <div className="convidado-card" key={evento.id}>
              <h3>{evento.nome}</h3>
              <p>Total de Convidados e acompanhantes: {totalParticipantes}</p>
              <p>Confirmados: {confirmados}</p>
              <p>Pendentes: {pendentes}</p>
              <div className="card-content">
                {convidadosEvento.map((convidado) => (
                  <div key={convidado.id} className="convidado-item">
                    {editIndex === convidado.id ? (
                      <div className="edit-form">
                        <input
                          type="text"
                          name="nome"
                          value={editData.nome}
                          onChange={handleChange}
                        />
                        <input
                          type="text"
                          name="telefone"
                          value={editData.telefone}
                          onChange={handleChange}
                        />
                        <input
                          type="email"
                          name="email"
                          value={editData.email}
                          onChange={handleChange}
                        />
                        <input
                          type="number"
                          name="acompanhante"
                          value={editData.acompanhante}
                          onChange={handleChange}
                        />
                        <button onClick={handleUpdate}>Salvar</button>
                        <button onClick={() => setEditIndex(null)}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <>
                        <p>
                          <strong>Nome:</strong> {convidado.nome}
                        </p>
                        <p>
                          <strong>Confirmado:</strong>{" "}
                          {convidado.confirmado ? "Sim" : "Não"}
                        </p>
                        <div className="acoes-card">
                          <FaEdit onClick={() => handleEdit(convidado.id)} />
                          <FaTrash onClick={() => handleDelete(convidado.id)} />
                          <FaWhatsapp
                            onClick={() =>
                              enviarWhatsapp(
                                convidado.telefone,
                                convidado.nome,
                                evento.id,
                                convidado.id
                              )
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Confirmacao;
