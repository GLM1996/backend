const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000; // Cambia el puerto si es necesario

// Middleware para procesar JSON
app.use(bodyParser.json());

// Ruta para recibir el webhook
app.post('/webhook', (req, res) => {
    console.log('Webhook recibido:', req.body);

    // Procesar el contenido del webhook
    const { event, data } = req.body;

    // Responde según el evento recibido
    if (event === 'deal.created') {
        console.log(`Nuevo trato creado: ${data.name}`);
    } else if (event === 'deal.updated') {
        console.log(`Trato actualizado: ${data.name}`);
    } else {
        console.log(`Evento desconocido: ${event}`);
    }

    // Responder al servidor que envió el webhook
    res.status(200).send({ success: true, message: 'Webhook procesado' });
});
app.get('/',(req,res)=>{
    res.send('Servidor Gustavo')
})
// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
