import { Link } from "react-router-dom";
import { useState } from "react";
import "../css/menu.css";

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="cabecalho">
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Abrir menu">
          ☰
        </button>
        <h1 className="menu-title">Menu</h1>
        <p className="menu-welcome">Bem-vindo(a), Administrador(a)</p>
      </header>

      {/* Fundo clicável para fechar o menu */}
      {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}

      <nav className={`menu-lateral ${isMenuOpen ? 'open' : ''}`}>
        <ul>
          <li>
            <Link to="/cadastroEvento" className="menu-item" onClick={closeMenu}>Eventos</Link>
          </li>
          <li>
            <Link to="/cadastroConvidado" className="menu-item" onClick={closeMenu}>Cadastrar Convidado</Link>
          </li>
          <li>
            <Link to="/confirmacao" className="menu-item" onClick={closeMenu}>Lista de convidados</Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default Menu;
