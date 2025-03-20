import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginAdministrador from './frontend/pages/login';
import CadastroAdministrador from './frontend/pages/cadastroAdm';
import Menu from './frontend/pages/menu';
import CadastroConvidados from './frontend/pages/cadastroConvidado';
import CadastroEventos from './frontend/pages/cadastroEvento';
import Confirmacao from './frontend/pages/confirmacao';
import Eventos from './frontend/pages/eventos';
import ButtonConf from './frontend/pages/button_conf';
import Index from './frontend/pages/index';
import PaginaInicial from "./frontend/pages/PaginaInicial"; // Importe a Página Inicial

// Importações das páginas do superadministrador
import SuperAdminDashboard from './frontend/pages/superadmin/SuperAdminDashboard';
import CadastrarPlano from './frontend/pages/superadmin/CadastrarPlano';
import LiberarAdministrador from './frontend/pages/superadmin/LiberarAdministrador';

function App() {
    return (
        <Router>
            <Routes>
                {/* Rota raiz redireciona para a Página Inicial */}
                <Route path="/" element={<PaginaInicial />} />

                {/* Rotas do superadministrador */}
                <Route path="/superadmin/SuperAdminDashboard" element={<SuperAdminDashboard />}>
                    <Route path="CadastrarPlano" element={<CadastrarPlano />} />
                    <Route path="LiberarAdministrador" element={<LiberarAdministrador />} />
                </Route>

                {/* Rotas existentes */}
                <Route path="/index" element={<Index />} />
                <Route path="/login" element={<LoginAdministrador />} />
                <Route path="/cadastroAdm" element={<CadastroAdministrador />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/cadastroConvidado" element={<CadastroConvidados />} />
                <Route path="/cadastroEvento" element={<CadastroEventos />} />
                <Route path="/confirmacao" element={<Confirmacao />} />
                <Route path="/eventos" element={<Eventos />} />
                <Route path="/confirmacao/:convidadoId" element={<ButtonConf />} />
            </Routes>
        </Router>
    );
}

export default App;