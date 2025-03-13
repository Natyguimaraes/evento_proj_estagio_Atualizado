
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginAdministrador from './frontend/pages/login';
import CadastroConvidados from './frontend/pages/cadastroConvidado';
import CadastroEventos from './frontend/pages/cadastroEvento'
import Confirmacao from './frontend/pages/confirmacao';
import Menu from './frontend/pages/menu';
import CadastroAdministrador from './frontend/pages/cadastroAdm';
import Eventos from './frontend/pages/eventos';
import ButtonConf from './frontend/pages/button_conf';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/cadastroAdm" element={<CadastroAdministrador />} />
                <Route path="/login" element={<LoginAdministrador />} />
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
