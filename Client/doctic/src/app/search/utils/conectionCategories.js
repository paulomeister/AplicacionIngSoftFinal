'use client'
import axios from "axios";

async function conectionCategories() {
    try {
        const response = await axios.get(`http://localhost:8080/api/Categorias/allDistinct`);
        return response.data;  
    } catch (error) {
        throw new Error('Error en la conexión a la API: ' + error.message);
    }
}

export default conectionCategories