import axios from "axios";

async function conection() {
    try {
        const response = await axios.get("http://localhost:8080/api/Usuarios/getByUsername/enunez");
        console.log(response.data);
        return response.data;  
    } catch (error) {
        throw new Error('Error en la conexión a la API: ' + error.message);
    }
}

export default conection