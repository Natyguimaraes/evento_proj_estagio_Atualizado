// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginAdministrador from './frontend/pages/login';
import CadastroConvidados from './frontend/pages/cadastroConvidado';
import Confirmacao from './frontend/pages/confirmacao';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginAdministrador />} />
                <Route path="/cadastroConvidados" element={<CadastroConvidados />} />
                <Route path="/confirmacao/:id" element={<Confirmacao />} />
            </Routes>
        </Router>
    );
}

export default App;
