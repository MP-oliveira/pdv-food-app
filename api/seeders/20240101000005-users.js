'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      {
        supabase_id: '00000000-0000-0000-0000-000000000001',
        name: 'Administrador',
        email: 'admin@pdvfood.com',
        role: 'admin',
        phone: '(11) 99999-9999',
        is_active: true,
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        supabase_id: '00000000-0000-0000-0000-000000000002',
        name: 'João Garçom',
        email: 'garcom@pdvfood.com',
        role: 'garcom',
        phone: '(11) 88888-8888',
        is_active: true,
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        supabase_id: '00000000-0000-0000-0000-000000000003',
        name: 'Maria Caixa',
        email: 'caixa@pdvfood.com',
        role: 'caixa',
        phone: '(11) 77777-7777',
        is_active: true,
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        supabase_id: '00000000-0000-0000-0000-000000000004',
        name: 'Pedro Cozinha',
        email: 'cozinha@pdvfood.com',
        role: 'cozinha',
        phone: '(11) 66666-6666',
        is_active: true,
        last_login: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
