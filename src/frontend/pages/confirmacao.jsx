import { useParams } from 'react-router-dom';

function Confirmacao() {
    const { id } = useParams();

    const confirmarPresenca = async (confirmado) => {
        await fetch(`http://localhost:5000/api/confirmacoes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ confirmado })
        });
        alert('Confirmação realizada com sucesso!');
    };

    return (
        <div>
            <h2>Confirme sua Presença</h2>
            <button onClick={() => confirmarPresenca(1)}>Confirmar Presença</button>
            <button onClick={() => confirmarPresenca(0)}>Não irei</button>
        </div>
    );
}
export default Confirmacao;
