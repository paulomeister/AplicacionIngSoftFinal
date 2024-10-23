import axios from "axios";

async function conectionDocuments(documento) {
    try {
        const response = await axios.get(`http://localhost:8080/api/Documentos/getByTitle/${encodeURIComponent(documento)}`);
        return response.data;  
    } catch (error) {
        throw new Error('Error en la conexión a la API: ' + error.message);
    }
}

export default conectionDocuments