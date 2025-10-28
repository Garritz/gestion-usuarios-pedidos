const errorHandler = (err, req, res, next) => {
  console.error('Error capturado por el middleware:', err);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      detalles: err.errors.map(e => ({
        campo: e.path,
        mensaje: e.message
      }))
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      error: 'Conflicto de datos únicos',
      detalles: err.errors.map(e => ({
        campo: e.path,
        mensaje: e.message
      }))
    });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Error de clave foránea',
      mensaje: 'Referencia inválida a otro registro'
    });
  }

  if (err.name === 'SequelizeDatabaseError') {
    return res.status(500).json({
      error: 'Error de base de datos',
      mensaje: 'Ha ocurrido un error en la base de datos'
    });
  }

  res.status(err.status || 500).json({
    error: 'Error interno del servidor',
    mensaje: process.env.NODE_ENV === 'development' ? err.message : 'Ha ocurrido un error'
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    ruta: req.originalUrl
  });
};

module.exports = { errorHandler, notFoundHandler };