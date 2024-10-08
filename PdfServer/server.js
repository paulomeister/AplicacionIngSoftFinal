const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 8045; // Puedes cambiar el puerto si es necesario

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static('public'));

// Ruta para servir un PDF específico
app.get('/pdf/:file', (req, res) => {
    const fileName = req.params.file;
    const filePath = path.join(__dirname, 'public', 'pdfs', fileName);

    // Verifica si el archivo existe
    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(404).send('File not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
