import { Link } from 'react-router-dom';
import '../css/dashboard.css';

function Dashboard() {
    return (
        <div className="painel">
            <div className="cabecalho">
                <h1>Painel Administrativo</h1>
                <p>Bem-vindo(a), Administrador(a)</p>
            </div>
            <div className="conteudo">
                <div className="painel-principal">
                    <div className="boas-vindas">
                        <h2>Gerencie seus eventos com facilidade!</h2>
                    </div>

                    <div className="cards">
                        <div className="card">
                            <h3>EVENTOS</h3>
                            <p>Cadastre aqui seu evento</p>
                            <Link to='/cadastroEvento' className="botao-card">Gerenciar</Link>
                        </div>

                        <div className="card">
                            <h3>Convidados</h3>
                            <p>Cadastre aqui seus convidados</p>
                            <Link to='/cadastroConvidado' className="botao-card">Gerenciar</Link>
                        </div>

                        <div className="card">
                            <h3>Confirmações</h3>
                            <p>Acompanhe as confirmações de presença dos seus convidados.</p>
                            <Link to='/confirmacao' className="botao-card">Acessar</Link>
                        </div>
                    </div>
                </div>
            </div>
            <div className="rodape">
                <p>&copy; {new Date().getFullYear()} Sistema de Eventos. Todos os direitos reservados.</p>
            </div>
        </div>
    );
}

export default Dashboard;