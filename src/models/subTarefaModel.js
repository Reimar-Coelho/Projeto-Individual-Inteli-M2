const db = require('../config/db');

module.exports = {
  // Listar todas as sub-tarefas de uma tarefa
  async findAllByTarefa(tarefa_pai_id) {
    const result = await db.query(
      'SELECT * FROM sub_tarefas WHERE tarefa_pai_id = $1 ORDER BY criado_em ASC',
      [tarefa_pai_id]
    );
    return result.rows;
  },

  // Buscar sub-tarefa por ID
  async findById(id) {
    const result = await db.query('SELECT * FROM sub_tarefas WHERE id = $1', [id]);
    return result.rows[0];
  },

  // Criar uma nova sub-tarefa
  async create(tarefa_pai_id, titulo, status = 'pendente') {
    const result = await db.query(
      'INSERT INTO sub_tarefas (tarefa_pai_id, titulo, status) VALUES ($1, $2, $3) RETURNING *',
      [tarefa_pai_id, titulo, status]
    );
    return result.rows[0];
  },

  // Atualizar uma sub-tarefa existente
  async update(id, titulo, status) {
    const result = await db.query(
      'UPDATE sub_tarefas SET titulo = $1, status = $2 WHERE id = $3 RETURNING *',
      [titulo, status, id]
    );
    return result.rows[0];
  },

  // Atualizar apenas o status de uma sub-tarefa
  async updateStatus(id, status) {
    const result = await db.query(
      'UPDATE sub_tarefas SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  // Deletar uma sub-tarefa
  async delete(id) {
    await db.query('DELETE FROM sub_tarefas WHERE id = $1', [id]);
  },

  // Verificar se a sub-tarefa pertence à tarefa especificada
  async belongsToTarefa(subTarefaId, tarefaPaiId) {
    const result = await db.query(
      'SELECT COUNT(*) FROM sub_tarefas WHERE id = $1 AND tarefa_pai_id = $2',
      [subTarefaId, tarefaPaiId]
    );
    return parseInt(result.rows[0].count) > 0;
  }
};
