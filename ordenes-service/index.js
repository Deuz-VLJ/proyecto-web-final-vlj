const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3002;

app.use(express.json());

// Arreglo en memoria para registro de ventas
const ordenes = [];
let idOrdenActual = 1;

app.post('/api/ordenes', async (req, res) => {
  const { libroId, cantidad, cliente } = req.body;

  if (!libroId || !cantidad || !cliente) {
    return res.status(400).json({ error: "Faltan datos requeridos (libroId, cantidad, cliente)" });
  }

  try {
    // Consulta al Servicio de Catálogo
    const response = await axios.get(`http://localhost:3001/api/libros/${libroId}`);
    const libro = response.data;

    // Verificar si hay stock suficiente (Reto Extra)
    if (libro.stock < cantidad) {
      return res.status(400).json({ error: "No hay stock suficiente para la cantidad solicitada", stockDisponible: libro.stock });
    }

    // Calcular el total a pagar
    const totalAPagar = libro.precio * cantidad;

    // Crear y guardar la nueva orden
    const nuevaOrden = {
      id: idOrdenActual++,
      cliente: cliente,
      libroId: libroId,
      libroTitulo: libro.titulo,
      cantidad: cantidad,
      totalAPagar: totalAPagar,
      fecha: new Date().toISOString()
    };
    
    ordenes.push(nuevaOrden);

    res.status(201).json({
      mensaje: "Orden creada exitosamente",
      orden: nuevaOrden
    });

  } catch (error) {
    // Si axios lanza un error es porque el catálogo respondió con algo distinto a 2xx (ej. 404)
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: "El libro solicitado no existe" });
    }
    
    // Otro tipo de errores
    console.error(error);
    res.status(500).json({ error: "Error interno del servidor de órdenes" });
  }
});

app.get('/api/ordenes', (req, res) => {
    res.status(200).json(ordenes);
});

app.listen(PORT, () => {
  console.log(`Servicio de Órdenes escuchando en el puerto ${PORT}`);
  console.log(`POST http://localhost:${PORT}/api/ordenes  <- endpoint para crear una orden`);
  console.log(`GET  http://localhost:${PORT}/api/ordenes  <- endpoint para listar ordenes`);
});
