'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('products', [
      {
        name: 'Hambúrguer Clássico',
        description: 'Hambúrguer com carne, queijo, alface, tomate e molho especial',
        price: 25.90,
        cost_price: 12.50,
        category_id: 1,
        preparation_time: 15,
        is_available: true,
        is_digital: false,
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Pizza Margherita',
        description: 'Pizza com molho de tomate, mussarela e manjericão',
        price: 35.90,
        cost_price: 18.00,
        category_id: 1,
        preparation_time: 20,
        is_available: true,
        is_digital: false,
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Refrigerante Lata',
        description: 'Refrigerante gelado em lata 350ml',
        price: 4.50,
        cost_price: 2.00,
        category_id: 2,
        preparation_time: 1,
        is_available: true,
        is_digital: false,
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Suco Natural',
        description: 'Suco natural de laranja ou maracujá',
        price: 8.90,
        cost_price: 3.50,
        category_id: 2,
        preparation_time: 5,
        is_available: true,
        is_digital: false,
        sort_order: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Pudim de Leite',
        description: 'Pudim caseiro com calda de caramelo',
        price: 12.90,
        cost_price: 5.00,
        category_id: 3,
        preparation_time: 10,
        is_available: true,
        is_digital: false,
        sort_order: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('products', null, {});
  }
};
