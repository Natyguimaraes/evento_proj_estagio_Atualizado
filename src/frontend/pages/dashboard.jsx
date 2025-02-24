import { Link } from 'react-router-dom';

function Dashboard() {
    return (
        <div>
            <h2>Painel Administrativo</h2>
            <nav>
                <ul>
                    <li><Link to='/cadastroEvento'>Cadastro de Eventos</Link></li>
                    <li><Link to='/cadastroConvidado'>Cadastro de Convidados</Link></li>
                    <li><Link to='/confirmacao'>Lista de Confirmação</Link></li>
                </ul>
            </nav>
        </div>
    );
}
export default Dashboard;