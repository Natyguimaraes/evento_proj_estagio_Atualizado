import { Link } from "react-router-dom";
import { useState } from "react";
import "../css/dashboard.css";

function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="cabecalho">
    <div className={`menu ${isMenuOpen ? 'open' : ''}`}>
        <button className="menu-toggle" onClick={toggleMenu}>
          <span className="menu-icon"></span>
        </button>
        <h1>Menu</h1>
        <p>Bem-vindo(a), Administrador(a)</p>
      </div>

      <div className={`menu-lateral ${isMenuOpen ? 'open' : ''}`}>
        <nav>
          <ul>
            <li>
              <Link to="/cadastroEvento" className="menu-item">Eventos</Link>
            </li>
            <li>
              <Link to="/cadastroConvidado" className="menu-item">Convidados</Link>
            </li>
            <li>
              <Link to="/confirmacao" className="menu-item">Confirmações</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Menu;
