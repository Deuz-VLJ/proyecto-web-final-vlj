const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

// Arreglo en memoria simulando base de datos
const libros = [
  { id: 1, titulo: "El Quijote", autor: "Miguel de Cervantes", precio: 20.00, stock: 10 },
  { id: 2, titulo: "Cien Años de Soledad", autor: "Gabriel García Márquez", precio: 25.50, stock: 5 },
  { id: 3, titulo: "1984", autor: "George Orwell", precio: 15.00, stock: 0 }, // Sin stock
  { id: 4, titulo: "El Principito", autor: "Antoine de Saint-Exupéry", precio: 12.00, stock: 20 },
  { id: 5, titulo: "Donde los árboles cantan", autor: "Laura Gallego", precio: 18.00, stock: 2 }
];

app.get('/api/libros/:id', (req, res) => {
  const libroId = parseInt(req.params.id);
  const libro = libros.find(l => l.id === libroId);

  if (libro) {
    res.status(200).json(libro);
  } else {
    res.status(404).json({ error: "El libro no existe en el catálogo" });
  }
});

app.listen(PORT, () => {
  console.log(`Servicio de Catálogo escuchando en el puerto ${PORT}`);
  console.log(`GET http://localhost:${PORT}/api/libros/:id  <- endpoint para consultar un libro`);
});
