const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Pedido = sequelize.define('Pedido', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'usuarios',
        key: 'id'
      },
      validate: {
        notNull: {
          msg: 'El ID de usuario es obligatorio'
        },
        isInt: {
          msg: 'El ID de usuario debe ser un número entero'
        }
      }
    },
    producto: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El producto no puede estar vacío'
        },
        len: {
          args: [2, 200],
          msg: 'El producto debe tener entre 2 y 200 caracteres'
        }
      }
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        notNull: {
          msg: 'La cantidad es obligatoria'
        },
        isInt: {
          msg: 'La cantidad debe ser un número entero'
        },
        min: {
          args: [1],
          msg: 'La cantidad debe ser al menos 1'
        }
      }
    },
    fecha_pedido: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'Debe proporcionar una fecha válida'
        }
      }
    }
  }, {
    tableName: 'pedidos',
    timestamps: true
  });

  return Pedido;
};