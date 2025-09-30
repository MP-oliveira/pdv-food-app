const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class AuthService {
  /**
   * Criar usuário no Supabase e no banco local
   */
  static async createUser(userData) {
    try {
      const { email, password, name, role = 'garcom', phone } = userData;

      // Criar usuário no Supabase
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name,
          role,
          phone
        }
      });

      if (authError) {
        throw new Error(`Erro ao criar usuário no Supabase: ${authError.message}`);
      }

      // Criar usuário no banco local
      const user = await User.create({
        supabase_id: authData.user.id,
        name,
        email,
        role,
        phone,
        is_active: true
      });

      return user;
    } catch (error) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  /**
   * Verificar token do Supabase e retornar usuário local
   */
  static async verifySupabaseToken(token) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (error || !user) {
        throw new Error('Token inválido');
      }

      // Buscar usuário no banco local
      const localUser = await User.findOne({
        where: { supabase_id: user.id }
      });

      if (!localUser || !localUser.is_active) {
        throw new Error('Usuário não encontrado ou inativo');
      }

      // Atualizar último login
      await localUser.update({ last_login: new Date() });

      return localUser;
    } catch (error) {
      throw new Error(`Erro na verificação: ${error.message}`);
    }
  }

  /**
   * Gerar JWT token para o usuário
   */
  static generateToken(user) {
    return jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  /**
   * Fazer login com email e senha
   */
  static async login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error('Email ou senha inválidos');
      }

      // Buscar usuário no banco local
      const user = await User.findOne({
        where: { supabase_id: data.user.id }
      });

      if (!user || !user.is_active) {
        throw new Error('Usuário não encontrado ou inativo');
      }

      // Atualizar último login
      await user.update({ last_login: new Date() });

      // Gerar token JWT
      const token = this.generateToken(user);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar_url: user.avatar_url
        },
        token,
        supabaseToken: data.session.access_token
      };
    } catch (error) {
      throw new Error(`Erro no login: ${error.message}`);
    }
  }

  /**
   * Fazer logout
   */
  static async logout(token) {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error('Erro ao fazer logout');
      }
      return { message: 'Logout realizado com sucesso' };
    } catch (error) {
      throw new Error(`Erro no logout: ${error.message}`);
    }
  }

  /**
   * Atualizar senha
   */
  static async updatePassword(token, newPassword) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw new Error('Erro ao atualizar senha');
      }

      return { message: 'Senha atualizada com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao atualizar senha: ${error.message}`);
    }
  }

  /**
   * Resetar senha
   */
  static async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.FRONTEND_URL}/reset-password`
      });

      if (error) {
        throw new Error('Erro ao enviar email de reset');
      }

      return { message: 'Email de reset enviado com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao resetar senha: ${error.message}`);
    }
  }
}

module.exports = AuthService;
