'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Pratos Principais',
        description: 'Pratos principais do nosso cardápio',
        color: '#FF6B6B',
        sort_order: 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Bebidas',
        description: 'Bebidas geladas e quentes',
        color: '#4ECDC4',
        sort_order: 2,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Sobremesas',
        description: 'Doces e sobremesas deliciosas',
        color: '#45B7D1',
        sort_order: 3,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
