const { crearOrden, buscarLibroPorId, listarOrdenes } = require('./_store');

async function consultarLibroEnCatalogo(req, libroId) {
  const proto = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  const baseUrl = `${proto}://${host}`;
  const response = await fetch(`${baseUrl}/api/libros/${libroId}`);

  if (response.status === 404) {
    return { notFound: true };
  }

  if (!response.ok) {
    throw new Error(`Error consultando catálogo: ${response.status}`);
  }

  return { notFound: false, libro: await response.json() };
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json(listarOrdenes());
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { libroId, cantidad, cliente } = req.body || {};

  if (!libroId || !cantidad || !cliente) {
    return res.status(400).json({ error: 'Faltan datos requeridos (libroId, cantidad, cliente)' });
  }

  try {
    const catalogo = await consultarLibroEnCatalogo(req, Number(libroId));

    if (catalogo.notFound) {
      return res.status(404).json({ error: 'El libro solicitado no existe' });
    }

    const libro = catalogo.libro || buscarLibroPorId(Number(libroId));

    if (libro.stock < Number(cantidad)) {
      return res.status(400).json({
        error: 'No hay stock suficiente para la cantidad solicitada',
        stockDisponible: libro.stock,
      });
    }

    const totalAPagar = libro.precio * Number(cantidad);
    const nuevaOrden = crearOrden({
      cliente,
      libroId: Number(libroId),
      libroTitulo: libro.titulo,
      cantidad: Number(cantidad),
      totalAPagar,
    });

    return res.status(201).json({
      mensaje: 'Orden creada exitosamente',
      orden: nuevaOrden,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error interno del servidor de órdenes' });
  }
};