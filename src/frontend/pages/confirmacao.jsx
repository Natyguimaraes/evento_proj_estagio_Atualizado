import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Trash2, Edit, Send, Plus, ChevronLeft, Loader2, Users, CalendarIcon } from "lucide-react";
import { toast } from "sonner"; // Importando diretamente do sonner

function Confirmacao() {
  const navigate = useNavigate();
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
        toast.error(`Erro ao buscar dados: ${error.message}`);
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
      toast.success("Convidado atualizado com sucesso!");
    } catch (error) {
      toast.error(`Erro ao atualizar convidado: ${error.message}`);
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
    toast({
      title: "Confirmação",
      description: "Tem certeza que deseja remover este acompanhante?",
      action: (
        <div className="flex gap-3 mt-2">
          <button 
            onClick={() => {
              setEditData((prev) => {
                const updatedAcompanhantes = prev.acompanhantes.filter((_, i) => i !== index);
                return { ...prev, acompanhantes: updatedAcompanhantes };
              });
              toast.success("Acompanhante removido!");
            }}
            className="bg-event-primary text-white px-3 py-1 rounded-full text-xs"
          >
            Confirmar
          </button>
          <button className="bg-gray-200 px-3 py-1 rounded-full text-xs">
            Cancelar
          </button>
        </div>
      ),
    });
  };

  const handleAddAcompanhante = () => {
    setEditData((prev) => ({
      ...prev,
      acompanhantes: [...prev.acompanhantes, { nome: "", telefone: "" }],
    }));
  };

  const handleSendWhatsapp = async (convidado) => {
    const linkConfirmacao = `http://localhost:5173/confirmacao/${convidado.id}`;
    const mensagem = `Olá ${convidado.nome}, confirme sua presença no evento acessando este link: ${linkConfirmacao}`;
    const linkWhatsapp = `https://api.whatsapp.com/send?phone=55${convidado.telefone}&text=${encodeURIComponent(mensagem)}`;

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
        toast.success("Confirmação enviada via WhatsApp!");
      } else {
        toast.error("Erro ao atualizar a confirmação.");
      }
    } catch (error) {
      toast.error("Erro ao enviar a mensagem.");
    }

    window.open(linkWhatsapp, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-event-background to-event-accent/10 py-12 px-4 sm:px-6 lg:px-8 page-transition">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-event-text-secondary hover:text-event-primary transition-colors mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Voltar</span>
        </button>
        
        <div className="flex items-center mb-8">
          <div className="event-chip bg-event-primary/10 text-event-primary mr-3">
            Confirmações
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-event-text-primary">
            Lista de Convidados
          </h1>
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4">
            <Loader2 className="h-10 w-10 text-event-primary animate-spin" />
            <p className="text-event-text-secondary">Carregando convidados...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {eventos.map((evento) => {
              const convidadosEvento = convidados.filter((c) => c.evento_id === evento.id);
              return (
                <div 
                  className="event-card animate-fade-in backdrop-blur-sm bg-white/60 rounded-2xl overflow-hidden" 
                  key={evento.id}
                  style={{ animationDelay: `${evento.id * 50}ms` }}
                >
                  <div className="p-6 border-b border-neutral-100">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <CalendarIcon className="h-5 w-5 text-event-primary" />
                        <h3 className="text-xl font-semibold text-event-text-primary">{evento.nome}</h3>
                      </div>
                      <div className="flex items-center">
                        <div className="flex items-center mr-3 bg-event-success/10 text-event-success py-1 px-3 rounded-full text-xs font-medium">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{convidadosEvento.length} convidados</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    {convidadosEvento.length > 0 ? (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-50/80">
                            <th className="px-6 py-3 text-left font-medium text-event-text-secondary tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left font-medium text-event-text-secondary tracking-wider">Telefone</th>
                            <th className="px-6 py-3 text-left font-medium text-event-text-secondary tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left font-medium text-event-text-secondary tracking-wider">Confirmado</th>
                            <th className="px-6 py-3 text-left font-medium text-event-text-secondary tracking-wider">Acompanhantes</th>
                            <th className="px-6 py-3 text-right font-medium text-event-text-secondary tracking-wider">Ações</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {convidadosEvento.map((convidado) => (
                            <tr key={convidado.id} className="hover:bg-gray-50/50 transition">
                              {editIndex === convidado.id ? (
                                <>
                                  <td className="px-6 py-4">
                                    <input
                                      type="text"
                                      name="nome"
                                      value={editData.nome}
                                      onChange={(e) => setEditData({ ...editData, nome: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-event-primary/20"
                                    />
                                  </td>
                                  <td className="px-6 py-4">
                                    <input
                                      type="text"
                                      name="telefone"
                                      value={editData.telefone}
                                      onChange={(e) => setEditData({ ...editData, telefone: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-event-primary/20"
                                    />
                                  </td>
                                  <td className="px-6 py-4">
                                    <input
                                      type="email"
                                      name="email"
                                      value={editData.email}
                                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-event-primary/20"
                                    />
                                  </td>
                                  <td className="px-6 py-4">
                                    {editData.acompanhantes.map((acompanhante, index) => (
                                      <div key={index} className="flex items-center space-x-2">
                                        <input
                                          type="text"
                                          value={acompanhante.nome}
                                          onChange={(e) => handleAcompanhanteChange(index, "nome", e.target.value)}
                                          placeholder="Nome do acompanhante"
                                          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        />
                                        <input
                                          type="text"
                                          value={acompanhante.telefone}
                                          onChange={(e) => handleAcompanhanteChange(index, "telefone", e.target.value)}
                                          placeholder="Telefone do acompanhante"
                                          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        />
                                        <button 
                                          type="button" 
                                          onClick={() => handleDeleteAcompanhante(index)}
                                          className="text-red-500"
                                        >
                                          <Trash2 className="h-5 w-5" />
                                        </button>
                                      </div>
                                    ))}
                                    <button 
                                      onClick={handleAddAcompanhante} 
                                      className="text-event-primary mt-2"
                                    >
                                      <Plus className="h-4 w-4 inline-block mr-2" />
                                      Adicionar acompanhante
                                    </button>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button 
                                      onClick={handleUpdate} 
                                      className="bg-event-primary text-white px-3 py-1 rounded-full"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                  </td>
                                </>
                              ) : (
                                <>
                                  <td className="px-6 py-4">{convidado.nome}</td>
                                  <td className="px-6 py-4">{convidado.telefone}</td>
                                  <td className="px-6 py-4">{convidado.email}</td>
                                  <td className="px-6 py-4">
                                    {convidado.confirmado ? (
                                      <span className="text-green-500">Confirmado</span>
                                    ) : (
                                      <span className="text-red-500">Não confirmado</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4">
                                    {convidado.acompanhantes.length > 0 ? (
                                      convidado.acompanhantes.map((acompanhante, index) => (
                                        <div key={index} className="text-sm text-event-text-secondary">
                                          {acompanhante.nome}
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-sm text-gray-400">Sem acompanhantes</span>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                    <button 
                                      onClick={() => handleSendWhatsapp(convidado)} 
                                      className="text-event-success mr-2"
                                    >
                                      <Send className="h-5 w-5" />
                                    </button>
                                    <button 
                                      onClick={() => handleEdit(convidado.id)} 
                                      className="text-event-primary mr-2"
                                    >
                                      <Edit className="h-5 w-5" />
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteConvidado(convidado.id)} 
                                      className="text-event-error"
                                    >
                                      <Trash2 className="h-5 w-5" />
                                    </button>
                                  </td>
                                </>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="p-6 text-center text-event-text-secondary">
                        Nenhum convidado encontrado.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Confirmacao;
