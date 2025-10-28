const { Pedido, Usuario, sequelize } = require('../models');

const pedidoController = {
  crearPedido: async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
      const { usuario_id, producto, cantidad } = req.body;

      if (!usuario_id || !producto) {
        await transaction.rollback();
        return res.status(400).json({
          error: 'El usuario_id y producto son obligatorios'
        });
      }

      const usuario = await Usuario.findByPk(usuario_id);

      if (!usuario) {
        await transaction.rollback();
        return res.status(404).json({
          error: 'El usuario especificado no existe'
        });
      }

      const pedido = await Pedido.create({
        usuario_id,
        producto,
        cantidad: cantidad || 1,
        fecha_pedido: new Date()
      }, { transaction });

      await transaction.commit();

      const pedidoCompleto = await Pedido.findByPk(pedido.id, {
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email']
        }]
      });

      res.status(201).json({
        mensaje: 'Pedido creado exitosamente',
        pedido: pedidoCompleto
      });
    } catch (error) {
      await transaction.rollback();

      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          error: 'Error de validación',
          detalles: error.errors.map(e => e.message)
        });
      }

      console.error('Error al crear pedido:', error);
      res.status(500).json({
        error: 'Error interno del servidor. La transacción ha sido revertida.'
      });
    }
  },

  obtenerPedidos: async (req, res) => {
    try {
      const pedidos = await Pedido.findAll({
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email']
        }],
        order: [['fecha_pedido', 'DESC']]
      });

      res.status(200).json({
        total: pedidos.length,
        pedidos
      });
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  },

  obtenerPedidoPorId: async (req, res) => {
    try {
      const { id } = req.params;

      const pedido = await Pedido.findByPk(id, {
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email']
        }]
      });

      if (!pedido) {
        return res.status(404).json({
          error: 'Pedido no encontrado'
        });
      }

      res.status(200).json({ pedido });
    } catch (error) {
      console.error('Error al obtener pedido:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  },

  actualizarPedido: async (req, res) => {
    try {
      const { id } = req.params;
      const { producto, cantidad } = req.body;

      const pedido = await Pedido.findByPk(id);

      if (!pedido) {
        return res.status(404).json({
          error: 'Pedido no encontrado'
        });
      }

      const datosActualizados = {};
      if (producto) datosActualizados.producto = producto;
      if (cantidad) datosActualizados.cantidad = cantidad;

      await pedido.update(datosActualizados);

      const pedidoActualizado = await Pedido.findByPk(id, {
        include: [{
          model: Usuario,
          as: 'usuario',
          attributes: ['id', 'nombre', 'email']
        }]
      });

      res.status(200).json({
        mensaje: 'Pedido actualizado exitosamente',
        pedido: pedidoActualizado
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          error: 'Error de validación',
          detalles: error.errors.map(e => e.message)
        });
      }

      console.error('Error al actualizar pedido:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  },

  eliminarPedido: async (req, res) => {
    try {
      const { id } = req.params;

      const pedido = await Pedido.findByPk(id);

      if (!pedido) {
        return res.status(404).json({
          error: 'Pedido no encontrado'
        });
      }

      await pedido.destroy();

      res.status(200).json({
        mensaje: 'Pedido eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      res.status(500).json({
        error: 'Error interno del servidor'
      });
    }
  }
};

module.exports = pedidoController;