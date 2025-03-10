import React, { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaWhatsapp } from "react-icons/fa";

function Confirmacao() {
  const [eventos, setEventos] = useState([]);
  const [convidados, setConvidados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState({ nome: "", telefone: "", email: "", acompanhante: "" });

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
      acompanhante: convidado.acompanhantes.length || 0,
    });
  };

  const handleChange = (e) => {
    setEditData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    if (!editIndex) return;
    try {
      await fetch(`http://localhost:5000/api/convidados/${editIndex}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      setConvidados((prev) => prev.map((c) => (c.id === editIndex ? { ...c, ...editData } : c)));
      setEditIndex(null);
      alert("Convidado atualizado com sucesso!");
    } catch (error) {
      alert(`Erro ao atualizar convidado: ${error.message}`);
    }
  };



  const enviarWhatsapp = (telefone, nome, evento_id, id) => {
    const evento = eventos.find((e) => e.id === evento_id)?.nome || "Evento";
    const msg = `Olá ${nome}, você está convidado para *${evento}*!\nConfirme sua presença:\n Sim: http://localhost:5000/api/convidados/${id}/confirmacao?status=sim\n Não: http://localhost:5000/api/convidados/${id}/confirmacao?status=nao`;
    window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleDeleteEvento = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esse evento?")) {
      try {
        await fetch(`http://localhost:5000/api/eventos/${id}`, { method: "DELETE" });
  
        // Remove o evento do estado corretamente
        setEventos((prev) => prev.filter((evento) => evento.id !== id));
  
        alert("Evento excluído com sucesso!");
      } catch (error) {
        alert(`Erro ao excluir evento: ${error.message}`);
      }
    }
  };
  

  return (
    <div className="confirmacao-container">
      <h1>Lista de Convidados por Evento</h1>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        eventos.map((evento) => {
          const convidadosEvento = convidados.filter((c) => c.evento_id === evento.id);
          const totalParticipantes = convidadosEvento.reduce((acc, convidado) => acc + 1 + convidado.acompanhantes.length, 0);
          return (
            <div className="evento-card" key={evento.id}>
              <h3>{evento.nome}</h3>
              <p>Total Participantes: {totalParticipantes}</p>
              <div className="convidados-lista">
                {convidadosEvento.map((convidado) => (
                  <div key={convidado.id} className="convidado-item">
                    {editIndex === convidado.id ? (
                      <div className="edit-form">
                        <input type="text" name="nome" value={editData.nome} onChange={handleChange} />
                        <input type="text" name="telefone" value={editData.telefone} onChange={handleChange} />
                        <input type="email" name="email" value={editData.email} onChange={handleChange} />
                        <button onClick={handleUpdate}>Salvar</button>
                        <button onClick={() => setEditIndex(null)}>Cancelar</button>
                      </div>
                    ) : (
                      <>
                        <p><strong>Nome:</strong> {convidado.nome}</p>
                        <p><strong>Confirmado:</strong> {convidado.confirmado ? "Sim" : "Não"}</p>
                        <p><strong>Acompanhante(s):</strong> 
                          {convidado.acompanhantes.length > 0 ? (
                            convidado.acompanhantes.map((acompanhante, index) => (
                              <span key={index}>{acompanhante.nome} ({acompanhante.telefone})</span>
                            ))
                          ) : (
                            "Nenhum"
                          )}
                        </p>
                        <div className="acoes">
                          <FaEdit onClick={() => handleEdit(convidado.id)} />
                          <FaTrash onClick={() => handleDelete(convidado.id)} />
                          <FaWhatsapp onClick={() => enviarWhatsapp(convidado.telefone, convidado.nome, evento.id, convidado.id)} />
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <FaTrash onClick={() => handleDeleteEvento(evento.id)} />
            </div>
          );
        })
      )}
     
    </div>
  );
}

export default Confirmacao;
