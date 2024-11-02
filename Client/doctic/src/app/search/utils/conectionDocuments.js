'use client'
import axios from "axios";

async function conectionDocuments(busqueda) {
    try {
        const response = await axios.post("http://localhost:8080/api/Documentos/onSearch/filter/", busqueda);
        return response.data;  
    } catch (error) {
        throw new Error('Error en la conexión a la API: ' + error.message);
    }
}

export default conectionDocuments