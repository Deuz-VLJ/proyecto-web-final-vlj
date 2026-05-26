const { buscarLibroPorId } = require('../_store');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const libroId = Number(req.query.id);
  const libro = buscarLibroPorId(libroId);

  if (libro) {
    return res.status(200).json(libro);
  }

  return res.status(404).json({ error: 'El libro no existe en el catálogo' });
};