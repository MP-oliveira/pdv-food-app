'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('stock', [
      {
        product_id: 1,
        current_quantity: 50,
        min_quantity: 10,
        max_quantity: 100,
        unit: 'unidade',
        last_updated: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 2,
        current_quantity: 30,
        min_quantity: 5,
        max_quantity: 50,
        unit: 'unidade',
        last_updated: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 3,
        current_quantity: 200,
        min_quantity: 50,
        max_quantity: 500,
        unit: 'unidade',
        last_updated: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 4,
        current_quantity: 100,
        min_quantity: 20,
        max_quantity: 200,
        unit: 'unidade',
        last_updated: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        product_id: 5,
        current_quantity: 25,
        min_quantity: 5,
        max_quantity: 50,
        unit: 'unidade',
        last_updated: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('stock', null, {});
  }
};
