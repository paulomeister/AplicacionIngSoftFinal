import axios from "axios";

async function conectionUser(username) {
    try {
        const response = await axios.get(`http://localhost:8080/api/Usuarios/getByUsername/${username}`);
        
        console.log(response)
        
        return response.data;  
    } catch (error) {
        throw new Error('Error en la conexión a la API: ' + error.message);
    }
}

export default conectionUser