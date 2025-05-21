const db = require('../config/db');

module.exports = {
  // Listar todas as categorias de um usuário
  async findAllByUser(usuario_id) {
    const result = await db.query(
      'SELECT * FROM categorias WHERE usuario_id = $1 ORDER BY nome ASC',
      [usuario_id]
    );
    return result.rows;
  },

  // Buscar categoria por ID
  async findById(id) {
    const result = await db.query('SELECT * FROM categorias WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Criar uma nova categoria
  async create(nome, usuario_id) {
    const result = await db.query(
      'INSERT INTO categorias (nome, usuario_id) VALUES ($1, $2) RETURNING *',
      [nome, usuario_id]
    );
    return result.rows[0];
  },

  // Atualizar uma categoria existente
  async update(id, nome) {
    const result = await db.query(
      'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, id]
    );
    return result.rows[0];
  },

  // Deletar uma categoria
  async delete(id) {
    await db.query('DELETE FROM categorias WHERE id = $1', [id]);
  },

  // Verificar se a categoria pertence ao usuário
  async belongsToUser(categoriaId, usuarioId) {
    const result = await db.query(
      'SELECT COUNT(*) FROM categorias WHERE id = $1 AND usuario_id = $2',
      [categoriaId, usuarioId]
    );
    return parseInt(result.rows[0].count) > 0;
  }
};
