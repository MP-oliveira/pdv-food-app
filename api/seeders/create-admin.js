const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const { User } = require('../models');

async function createAdmin() {
  try {
    console.log('🔐 Criando usuário admin...');

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@teste.com',
      password: '123456',
      email_confirm: true
    });

    if (authError) {
      console.error('❌ Erro ao criar usuário no Supabase Auth:', authError);
      return;
    }

    console.log('✅ Usuário criado no Supabase Auth');

    // Criar usuário na tabela users
    const user = await User.create({
      supabase_id: authData.user.id,
      name: 'Admin Teste',
      email: 'admin@teste.com',
      role: 'admin',
      is_active: true
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email:', user.email);
    console.log('🔑 Senha: 123456');
    console.log('👤 Role:', user.role);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

createAdmin();
