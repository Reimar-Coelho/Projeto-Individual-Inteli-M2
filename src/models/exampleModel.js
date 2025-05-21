const db = require('../config/db');

module.exports = {
  // Listar todos os usuários
  async findAll() {
    const result = await db.query('SELECT * FROM users ORDER BY nome ASC');
    return result.rows;
  },

  // Criar um novo usuário
  async create(nome, email) {
    const result = await db.query(
      'INSERT INTO users (nome, email) VALUES ($1, $2) RETURNING *',
      [nome, email]
    );
    return result.rows[0];
  },

  // Atualizar um usuário existente
  async update(id, nome, email) {
    const result = await db.query(
      'UPDATE users SET nome = $1, email = $2 WHERE id = $3 RETURNING *',
      [nome, email, id]
    );
    return result.rows[0];
  },

  // Deletar um usuário
  async delete(id) {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
  }
};