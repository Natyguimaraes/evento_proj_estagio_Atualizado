import { Link } from 'react-router-dom';
import '../css/dashboard.css'

function Dashboard() {
    return (
        <div className="painel">
            <h2>Painel Administrativo</h2>
           <div className="cards">
            <nav>
                <ul>
                    <li><Link to='/cadastroEvento'>Cadastro de Eventos</Link></li>
                    <li><Link to='/cadastroConvidado'>Cadastro de Convidados</Link></li>
                    <li><Link to='/confirmacao'>Lista de Confirmação</Link></li>
                </ul>
            </nav>
            </div>
        </div>
    );
}
export default Dashboard;