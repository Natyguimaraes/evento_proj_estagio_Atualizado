// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginAdministrador from './frontend/pages/login';
import CadastroConvidados from './frontend/pages/cadastroConvidado';
import CadastroEventos from './frontend/pages/cadastroEvento'
import Confirmacao from './frontend/pages/confirmacao';
import Dashboard from './frontend/pages/dashboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginAdministrador />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/cadastroConvidado" element={<CadastroConvidados />} />
                <Route path="/cadastroEvento" element={<CadastroEventos />} />
                <Route path="/confirmacao/:id" element={<Confirmacao />} />
            </Routes>
        </Router>
    );
}

export default App;
