const libros = [
  { id: 1, titulo: 'El Quijote', autor: 'Miguel de Cervantes', precio: 20, stock: 10 },
  { id: 2, titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', precio: 25.5, stock: 5 },
  { id: 3, titulo: '1984', autor: 'George Orwell', precio: 15, stock: 0 },
  { id: 4, titulo: 'El Principito', autor: 'Antoine de Saint-Exupéry', precio: 12, stock: 20 },
  { id: 5, titulo: 'Donde los árboles cantan', autor: 'Laura Gallego', precio: 18, stock: 2 },
];

const ordenes = [];
let idOrdenActual = 1;

function listarLibros() {
  return libros;
}

function buscarLibroPorId(id) {
  return libros.find((libro) => libro.id === id);
}

function crearOrden({ cliente, libroId, libroTitulo, cantidad, totalAPagar }) {
  const orden = {
    id: idOrdenActual++,
    cliente,
    libroId,
    libroTitulo,
    cantidad,
    totalAPagar,
    fecha: new Date().toISOString(),
  };

  ordenes.push(orden);
  return orden;
}

function listarOrdenes() {
  return ordenes;
}

module.exports = {
  listarLibros,
  buscarLibroPorId,
  crearOrden,
  listarOrdenes,
};