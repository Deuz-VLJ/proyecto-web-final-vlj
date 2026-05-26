# Proyecto final - Librería Express

Este proyecto incluye dos servicios Node.js para la evaluación original y una interfaz gráfica lista para Vercel.

## Estructura

- `catalogo-service/`: servicio de catálogo con Express.
- `ordenes-service/`: servicio de órdenes con Express y Axios.
- `api/`: capa compatible con Vercel para catálogo y órdenes.
- `index.html`, `styles.css`, `app.js`: interfaz gráfica responsive.

## Rutas principales

- `GET /api/libros` - lista los libros.
- `GET /api/libros/:id` - consulta un libro.
- `POST /api/ordenes` - crea una orden.
- `GET /api/ordenes` - lista órdenes.

## Ejecución local de los servicios originales

```powershell
cd "c:\Users\juank\OneDrive\Escritorio\pagina web (proyecto final)\catalogo-service"
npm start

cd "c:\Users\juank\OneDrive\Escritorio\pagina web (proyecto final)\ordenes-service"
npm start
```

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Conecta el repositorio en Vercel.
3. Vercel detectará `index.html` y la carpeta `api/`.
4. La interfaz se podrá abrir desde el celular o cualquier otra computadora con la URL pública.