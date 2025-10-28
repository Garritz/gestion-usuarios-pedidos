const { sequelize } = require('../config/database');
const UsuarioModel = require('./Usuario');
const PedidoModel = require('./Pedido');

const Usuario = UsuarioModel(sequelize);
const Pedido = PedidoModel(sequelize);

Usuario.hasMany(Pedido, {
  foreignKey: 'usuario_id',
  as: 'pedidos',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Pedido.belongsTo(Usuario, {
  foreignKey: 'usuario_id',
  as: 'usuario',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

const sincronizarModelos = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log('Modelos sincronizados correctamente.');
  } catch (error) {
    console.error('Error al sincronizar modelos:', error);
    throw error;
  }
};

module.exports = {
  sequelize,
  Usuario,
  Pedido,
  sincronizarModelos
};