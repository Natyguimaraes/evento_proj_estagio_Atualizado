
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginAdministrador from './frontend/pages/login';
import CadastroConvidados from './frontend/pages/cadastroConvidado';
import CadastroEventos from './frontend/pages/cadastroEvento'
import Confirmacao from './frontend/pages/confirmacao';
import Dashboard from './frontend/pages/dashboard';
import CadastroAdministrador from './frontend/pages/cadastro';
import Eventos from './frontend/pages/eventos';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/cadastro" element={<CadastroAdministrador />} />
                <Route path="/login" element={<LoginAdministrador />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cadastroConvidado" element={<CadastroConvidados />} />
                <Route path="/cadastroEvento" element={<CadastroEventos />} />
                <Route path="/confirmacao" element={<Confirmacao />} />
                <Route path="/eventos" element={<Eventos />} />
            </Routes>
        </Router>
    );
}

export default App;
