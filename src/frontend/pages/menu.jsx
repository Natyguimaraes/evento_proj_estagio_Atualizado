import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu as MenuIcon, X, Calendar, UserPlus, List } from "lucide-react";

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscKey);
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      window.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const menuItems = [
    { to: "/cadastroEvento", label: "Cadastrar evento", icon: <Calendar className="mr-3 h-5 w-5 text-yellow-500" /> },
    { to: "/cadastroConvidado", label: "Cadastrar Convidado", icon: <UserPlus className="mr-3 h-5 w-5 text-red-500" /> },
    { to: "/confirmacao", label: "Lista de convidados", icon: <List className="mr-3 h-5 w-5 text-gray-500" /> },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex items-center justify-between">
        <button className="text-gray-700 hover:scale-105" onClick={toggleMenu} aria-label="Abrir menu">
          {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
        <h1 className="text-lg font-semibold text-yellow-500">Menu</h1>
        <p className="text-sm font-medium text-gray-600">Bem-vindo(a), <span className="text-yellow-500">Administrador(a)</span></p>
      </header>

      {isMenuOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={closeMenu}></div>}

      <nav className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-yellow-500">Navegação</h2>
          <button onClick={closeMenu} className="p-2 rounded-full hover:bg-gray-200" aria-label="Fechar menu">
            <X size={20} className="text-yellow-500" />
          </button>
        </div>
        <ul className="py-4 px-3">
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              <Link to={item.to} className="flex items-center p-2 text-gray-700 hover:text-yellow-500 hover:bg-gray-100 rounded-lg transition" onClick={closeMenu}>
                {item.icon}
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="pt-16" />
    </>
  );
}

export default Menu;