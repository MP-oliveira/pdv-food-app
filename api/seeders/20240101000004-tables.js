'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tables', [
      {
        number: 1,
        name: 'Mesa 1',
        capacity: 4,
        location: 'Salão Principal',
        is_available: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        number: 2,
        name: 'Mesa 2',
        capacity: 6,
        location: 'Salão Principal',
        is_available: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        number: 3,
        name: 'Mesa 3',
        capacity: 2,
        location: 'Varanda',
        is_available: true,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tables', null, {});
  }
};
