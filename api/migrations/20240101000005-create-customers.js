'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      document: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'CPF ou CNPJ'
      },
      document_type: {
        type: Sequelize.ENUM('cpf', 'cnpj'),
        allowNull: true
      },
      address: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Endereço completo em JSON'
      },
      birth_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      is_vip: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      total_orders: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      total_spent: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00
      },
      last_order_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  }
};
