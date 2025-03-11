import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaWhatsapp, FaPlus } from "react-icons/fa";

function Confirmacao() {
  const [eventos, setEventos] = useState([]);
  const [convidados, setConvidados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({
    nome: "",
    telefone: "",
    email: "",
    acompanhantes: [],
  });

  useEffect(() => {
    async function fetchDados() {
      setLoading(true);
      try {
        const [eventosRes, convidadosRes] = await Promise.all([
          fetch("http://localhost:5000/api/eventos"),
          fetch("http://localhost:5000/api/convidados"),
        ]);

        if (!eventosRes.ok || !convidadosRes.ok) throw new Error("Erro ao buscar dados");

        setEventos(await eventosRes.json());
        setConvidados(await convidadosRes.json());
      } catch (error) {
        alert(`Erro ao buscar dados: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchDados();
  }, []);

  const handleEdit = (id) => {
    const convidado = convidados.find((c) => c.id === id);
    if (!convidado) return;
    setEditIndex(id);
    setEditData({
      nome: convidado.nome || "",
      telefone: convidado.telefone || "",
      email: convidado.email || "",
      acompanhantes: convidado.acompanhantes || [],
    });
  };

  const handleDeleteConvidado = async (id) => {
    if (!window.confirm("Tem certeza que deseja remover este convidado?")) return;

    try {
      await fetch(`http://localhost:5000/api/convidados/${id}`, {
        method: "DELETE",
      });

      setConvidados((prev) => prev.filter((c) => c.id !== id));
      alert("Convidado removido com sucesso!");
    } catch (error) {
      alert(`Erro ao excluir convidado: ${error.message}`);
    }
  };

  const handleUpdate = async () => {
    if (!editIndex) return;
    try {
      await fetch(`http://localhost:5000/api/convidados/${editIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      setConvidados((prev) =>
        prev.map((c) => (c.id === editIndex ? { ...c, ...editData } : c))
      );
      setEditIndex(null);
      alert("Convidado atualizado com sucesso!");
    } catch (error) {
      alert(`Erro ao atualizar convidado: ${error.message}`);
    }
  };

  const handleAcompanhanteChange = (index, campo, valor) => {
    setEditData((prev) => {
      const updatedAcompanhantes = [...prev.acompanhantes];
      updatedAcompanhantes[index] = { ...updatedAcompanhantes[index], [campo]: valor };
      return { ...prev, acompanhantes: updatedAcompanhantes };
    });
  };

  const handleDeleteAcompanhante = (index) => {
    if (!window.confirm("Tem certeza que deseja remover este acompanhante?")) return;
    
    setEditData((prev) => {
      const updatedAcompanhantes = prev.acompanhantes.filter((_, i) => i !== index);
      return { ...prev, acompanhantes: updatedAcompanhantes };
    });
  };

  const handleAddAcompanhante = () => {
    setEditData((prev) => ({
      ...prev,
      acompanhantes: [...prev.acompanhantes, { nome: "", telefone: "" }],
    }));
  };

  const handleSendWhatsapp = async (convidado) => {
    // Defina a URL correta para a página de confirmação no frontend
    const linkConfirmacao = `http://localhost:5173/confirmacao/${convidado.id}`;
    const mensagem = `Olá ${convidado.nome}, confirme sua presença no evento acessando este link: ${linkConfirmacao}`;
    const linkWhatsapp = `https://api.whatsapp.com/send?phone=55${convidado.telefone}&text=${encodeURIComponent(mensagem)}`;

    // Atualiza automaticamente no banco de dados
    try {
      const resposta = await fetch(`http://localhost:5000/api/convidados/${convidado.id}/confirmar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
  
      if (resposta.ok) {
        setConvidados((prev) =>
          prev.map((c) =>
            c.id === convidado.id ? { ...c, confirmado: true } : c
          )
        );
        alert("Confirmação enviada via WhatsApp!");
      } else {
        alert("Erro ao atualizar a confirmação.");
      }
    } catch (error) {
      alert("Erro ao enviar a mensagem.");
    }
  
    // Abre o link do WhatsApp em uma nova aba
    window.open(linkWhatsapp, "_blank");
};

  
  
  return (
    <div className="confirmacao-container">
      <h1>Lista de Convidados por Evento</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        eventos.map((evento) => {
          const convidadosEvento = convidados.filter((c) => c.evento_id === evento.id);
          return (
            <div className="evento-card" key={evento.id}>
              <h3>{evento.nome}</h3>
              <p>Total Convidados: {convidadosEvento.length}</p>
              <div className="convidados-lista">
                {convidadosEvento.map((convidado) => (
                  <div key={convidado.id} className="convidado-item">
                    {editIndex === convidado.id ? (
                      <div className="edit-form">
                        <input type="text" name="nome" value={editData.nome} onChange={(e) => setEditData({ ...editData, nome: e.target.value })} />
                        <input type="text" name="telefone" value={editData.telefone} onChange={(e) => setEditData({ ...editData, telefone: e.target.value })} />
                        <input type="email" name="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} />

                        <h4>Acompanhantes:</h4>
                        {editData.acompanhantes.map((acompanhante, index) => (
                          <div key={index} className="acompanhante-edit">
                            <input
                              type="text"
                              value={acompanhante.nome}
                              onChange={(e) => handleAcompanhanteChange(index, "nome", e.target.value)}
                              placeholder="Nome do acompanhante"
                            />
                            <input
                              type="text"
                              value={acompanhante.telefone}
                              onChange={(e) => handleAcompanhanteChange(index, "telefone", e.target.value)}
                              placeholder="Telefone do acompanhante"
                            />
                            <FaTrash onClick={() => handleDeleteAcompanhante(index)} />
                          </div>
                        ))}

                        <button onClick={handleAddAcompanhante}>
                          <FaPlus /> Adicionar Acompanhante
                        </button>

                        <button onClick={handleUpdate}>Salvar</button>
                        <button onClick={() => setEditIndex(null)}>Cancelar</button>
                      </div>
                    ) : (
                      <>
                        <p><strong>Nome:</strong> {convidado.nome}</p>
                        <p><strong>Telefone:</strong> {convidado.telefone}</p>
                        <p><strong>Confirmado:</strong> {convidado.confirmado ? "Sim" : "Não"}</p>
                        <p><strong>Acompanhantes:</strong></p>
                        {convidado.acompanhantes.length > 0 ? (
                          <ul>
                            {convidado.acompanhantes.map((acompanhante, index) => (
                              <li key={index}>
                                {acompanhante.nome} ({acompanhante.telefone})
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>Nenhum acompanhante</p>
                        )}
                        <div className="acoes">
                          <FaEdit onClick={() => handleEdit(convidado.id)} />
                          <FaTrash onClick={() => handleDeleteConvidado(convidado.id)} />
                          <FaWhatsapp onClick={() => handleSendWhatsapp(convidado)} style={{ cursor: "pointer", color: "green" }} />
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
