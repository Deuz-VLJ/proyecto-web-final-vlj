const catalogList = document.getElementById('catalogList');
const bookForm = document.getElementById('bookForm');
const orderForm = document.getElementById('orderForm');
const bookResult = document.getElementById('bookResult');
const orderResult = document.getElementById('orderResult');
const reloadCatalog = document.getElementById('reloadCatalog');
const bookTemplate = document.getElementById('bookCardTemplate');

function money(value) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 2,
  }).format(value);
}

function setResult(element, type, message) {
  element.className = `result ${type}`;
  element.innerHTML = message;
}

function renderBooks(books) {
  catalogList.innerHTML = '';

  books.forEach((book) => {
    const node = bookTemplate.content.cloneNode(true);
    node.querySelector('h3').textContent = `${book.id}. ${book.titulo}`;
    node.querySelector('.author').textContent = book.autor;
    node.querySelector('.book-meta').textContent = `Precio: ${money(book.precio)} · Stock: ${book.stock}`;
    catalogList.appendChild(node);
  });
}

async function loadCatalog() {
  catalogList.innerHTML = '<div class="result muted">Cargando catálogo...</div>';

  try {
    const response = await fetch('/api/libros');
    const books = await response.json();
    renderBooks(books);
  } catch (error) {
    catalogList.innerHTML = '<div class="result error">No fue posible cargar el catálogo.</div>';
  }
}

bookForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('bookId').value.trim();

  if (!id) {
    setResult(bookResult, 'error', 'Ingresa un ID para buscar el libro.');
    return;
  }

  setResult(bookResult, 'muted', 'Buscando libro...');

  try {
    const response = await fetch(`/api/libros/${id}`);
    const data = await response.json();

    if (!response.ok) {
      setResult(bookResult, 'error', data.error || 'No se encontró el libro.');
      return;
    }

    setResult(
      bookResult,
      'success',
      `<strong>${data.titulo}</strong><br>${data.autor}<br>Precio: ${money(data.precio)}<br>Stock: ${data.stock}`
    );
  } catch (error) {
    setResult(bookResult, 'error', 'Error consultando el catálogo.');
  }
});

orderForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const cliente = document.getElementById('cliente').value.trim();
  const libroId = Number(document.getElementById('orderBookId').value);
  const cantidad = Number(document.getElementById('cantidad').value);

  setResult(orderResult, 'muted', 'Creando orden...');

  try {
    const response = await fetch('/api/ordenes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cliente, libroId, cantidad }),
    });

    const data = await response.json();

    if (!response.ok) {
      setResult(orderResult, 'error', data.error || 'No se pudo crear la orden.');
      return;
    }

    setResult(
      orderResult,
      'success',
      `<strong>${data.mensaje}</strong><br>Orden #${data.orden.id}<br>Libro: ${data.orden.libroTitulo}<br>Total: ${money(data.orden.totalAPagar)}`
    );

    await loadCatalog();
  } catch (error) {
    setResult(orderResult, 'error', 'Error creando la orden.');
  }
});

reloadCatalog.addEventListener('click', loadCatalog);

loadCatalog();