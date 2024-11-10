import './page.css';

function searchPage() {
    
    return (
        <div class="error-container">
            <div class="error-icon">🚫OPSS...</div>
            <h1>Perfil no encontrado</h1>
            <p>El usuario que buscas no se encuentra actualmente registrado en nuestra base de datos.</p>
            <a href="/" class="back-button">Inicio</a>
        </div>
    );
}

export default searchPage