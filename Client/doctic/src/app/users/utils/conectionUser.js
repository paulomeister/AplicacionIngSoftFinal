import axios from "axios";

async function conectionUser() {
    try {
        const response = await axios.get(`http://localhost:8080/api/Usuarios/getByUsername/enunez`);
        return response.data;  
    } catch (error) {
        throw new Error('Error en la conexión a la API: ' + error.message);
    }
}

export default conectionUser