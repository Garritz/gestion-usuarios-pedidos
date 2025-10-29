# Proyecto: Sistema de gestión de tienda online

## Estructura del proyecto

```
tienda-online/
├── config/
│   └── database.js
├── models/
│   ├── index.js
│   ├── Usuario.js
│   └── Pedido.js
├── routes/
│   ├── usuarios.js
│   └── pedidos.js
├── controllers/
│   ├── usuarioController.js
│   └── pedidoController.js
├── middleware/
│   └── errorHandler.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## Paso 1: Instalar dependencias

### 1.1 Inicializar el proyecto

```bash
npm init -y
```

### 1.2 Instalar las dependencias necesarias

```bash
npm install express sequelize pg pg-hstore dotenv bcrypt
npm install --save-dev nodemon
```

**Dependencias instaladas:**
- `express`: Framework web
- `sequelize`: ORM para PostgreSQL
- `pg` y `pg-hstore`: Driver de PostgreSQL
- `dotenv`: Gestión de variables de entorno
- `bcrypt`: Hash de contraseñas
- `nodemon`: Reinicio automático (desarrollo)

### 1.3 Configurar package.json

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

## Paso 2: Configurar PostgreSQL

### 2.2 Crear la Base de Datos

```bash
psql -U postgres
CREATE DATABASE tienda_online;
\q
```

## Paso 3: Configurar variables de entorno

Crear el archivo `.env` en la raíz del proyecto:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tienda_online
DB_USER=postgres
DB_PASSWORD=tu_contraseña
PORT=3000
NODE_ENV=development
```

Crea también `.env.example` (sin datos sensibles):

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tienda_online
DB_USER=postgres
DB_PASSWORD=
PORT=3000
NODE_ENV=development
```

## Paso 4: Crear archivo .gitignore

Crea `.gitignore`:

```
node_modules/
.env
npm-debug.log
.DS_Store
```

## Paso 5: Ejecutar el proyecto

### 5.1 Iniciar el servidor

```bash
npm run dev
```

### 5.2 Verificar la conexión

Debería verse en la consola:
```
Conexión a la base de datos establecida correctamente.
Servidor corriendo en http://localhost:3000
```

## Paso 6: Pruebas con Postman

### Endpoints disponibles:

**Usuarios:**
- `POST http://localhost:3000/api/usuarios` - Crear usuario
- `GET http://localhost:3000/api/usuarios` - Listar usuarios
- `GET http://localhost:3000/api/usuarios/:id` - Obtener usuario
- `PUT http://localhost:3000/api/usuarios/:id` - Actualizar usuario
- `DELETE http://localhost:3000/api/usuarios/:id` - Eliminar usuario

**Pedidos:**
- `POST http://localhost:3000/api/pedidos` - Crear pedido
- `GET http://localhost:3000/api/pedidos` - Listar pedidos
- `GET http://localhost:3000/api/usuarios/:id/pedidos` - Pedidos de un usuario

### Ejemplos de Peticiones:

**Crear Usuario:**
```json
POST /api/usuarios
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "contrasena": "password123"
}
```

**Crear Pedido:**
```json
POST /api/pedidos
{
  "usuario_id": 1,
  "producto": "Laptop",
  "cantidad": 2
}
```

## Solución de Problemas Comunes

### Error: "ECONNREFUSED"
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en `.env`

### Error: "relation does not exist"
- Las tablas se crean automáticamente al iniciar
- Verifica que la base de datos exista

### Error: "password authentication failed"
- Verifica usuario y contraseña en `.env`
- Asegúrate de usar el usuario correcto de PostgreSQL

## Notas Importantes

1. Las tablas se crean automáticamente gracias a `sequelize.sync()`
2. Las contraseñas se hashean automáticamente con bcrypt
3. Las transacciones garantizan la consistencia de datos
4. Los errores se manejan centralizadamente

## Screenshots de la bd local

