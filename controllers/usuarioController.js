const { Usuario, Pedido } = require('../models');

const usuarioController = {
  crearUsuario: async (req, res) => {
    try {
      const { nombre, email, contrasena } = req.body;

      if (!nombre || !email || !contrasena) {
        return res.status(400).json({
          error: 'Todos los campos son obligatorios'
        });
      }

      const usuario = await Usuario.create({
        nombre,
        email,
        contrasena
      });

      res.status(201).json({
        mensaje: 'Usuario creado exitosamente',
        usuario
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          error: 'Error de validación',
          detalles: error.errors.map(e => e.message)
        });
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          error: 'Este email ya está registrado'
        });
      }

      console.error('Error al crear usuario:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  },

  obtenerUsuarios: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ['contrasena'] },
        order: [['id', 'ASC']]
      });

      res.status(200).json({
        total: usuarios.length,
        usuarios
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  },

  obtenerUsuarioPorId: async (req, res) => {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id, {
        attributes: { exclude: ['contrasena'] }
      });

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      res.status(200).json({ usuario });
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  },

  actualizarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, email, contrasena } = req.body;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      const datosActualizados = {};
      if (nombre) datosActualizados.nombre = nombre;
      if (email) datosActualizados.email = email;
      if (contrasena) datosActualizados.contrasena = contrasena;

      await usuario.update(datosActualizados);

      res.status(200).json({
        mensaje: 'Usuario actualizado exitosamente',
        usuario
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          error: 'Error de validación',
          detalles: error.errors.map(e => e.message)
        });
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          error: 'Este email ya está registrado'
        });
      }

      console.error('Error al actualizar usuario:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  },

  eliminarUsuario: async (req, res) => {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      await usuario.destroy();

      res.status(200).json({
        mensaje: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  },

  obtenerPedidosDeUsuario: async (req, res) => {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);

      if (!usuario) {
        return res.status(404).json({
          error: 'Usuario no encontrado'
        });
      }

      const pedidos = await Pedido.findAll({
        where: { usuario_id: id },
        order: [['fecha_pedido', 'DESC']]
      });

      res.status(200).json({
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email
        },
        total_pedidos: pedidos.length,
        pedidos
      });
    } catch (error) {
      console.error('Error al obtener pedidos del usuario:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }
};

module.exports = usuarioController;