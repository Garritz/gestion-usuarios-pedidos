const express = require('express');
require('dotenv').config();

const { testConnection } = require('./config/database');
const { sincronizarModelos } = require('./models');
const usuariosRoutes = require('./routes/usuarios');
const pedidosRoutes = require('./routes/pedidos');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API de Tienda Online',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      pedidos: '/api/pedidos'
    }
  });
});

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/pedidos', pedidosRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const iniciarServidor = async () => {
  try {
    await testConnection();
    
    await sincronizarModelos();
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
      console.log('Presiona Ctrl+C para detener el servidor');
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

iniciarServidor();

module.exports = app;