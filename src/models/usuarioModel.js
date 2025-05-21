const db = require('../config/db');

module.exports = {
  // Listar todos os usuários
  async findAll() {
    const result = await db.query('SELECT id, nome_usuario, email, criado_em FROM usuarios ORDER BY nome_usuario ASC');
    return result.rows;
  },

  // Encontrar usuário por ID
  async findById(id) {
    const result = await db.query('SELECT id, nome_usuario, email, criado_em FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Encontrar usuário por nome de usuário
  async findByUsername(nome_usuario) {
    const result = await db.query('SELECT * FROM usuarios WHERE nome_usuario = $1', [nome_usuario]);
    return result.rows[0];
  },

  // Encontrar usuário por email
  async findByEmail(email) {
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
  },

  // Criar um novo usuário
  async create(nome_usuario, email, senha_hash) {
    const result = await db.query(
      'INSERT INTO usuarios (nome_usuario, email, senha_hash) VALUES ($1, $2, $3) RETURNING id, nome_usuario, email, criado_em',
      [nome_usuario, email, senha_hash]
    );
    return result.rows[0];
  },

  // Atualizar um usuário existente
  async update(id, nome_usuario, email) {
    const result = await db.query(
      'UPDATE usuarios SET nome_usuario = $1, email = $2 WHERE id = $3 RETURNING id, nome_usuario, email',
      [nome_usuario, email, id]
    );
    return result.rows[0];
  },

  // Atualizar senha de usuário
  async updatePassword(id, senha_hash) {
    await db.query('UPDATE usuarios SET senha_hash = $1 WHERE id = $2', [senha_hash, id]);
  },

  // Deletar um usuário
  async delete(id) {
    await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
  }
};
