import { Link } from 'react-router-dom';

function Dashboard() {
    return (
        <div>
            <h2>Painel Administrativo</h2>
            <nav>
                <ul>
                    <li><Link to='/cadastro-eventos'>Cadastro de Eventos</Link></li>
                    <li><Link to='/cadastro-convidados'>Cadastro de Convidados</Link></li>
                    <li><Link to='/confirmacoes'>Lista de Confirmação</Link></li>
                </ul>
            </nav>
        </div>
    );
}
export default Dashboard;