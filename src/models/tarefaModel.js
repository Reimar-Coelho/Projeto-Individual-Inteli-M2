const db = require('../config/db');

module.exports = {
  // Listar todas as tarefas de um usuário
  async findAllByUser(usuario_id) {
    const result = await db.query(
      `SELECT t.*, 
        (SELECT array_agg(c.id) FROM categorias c 
         JOIN tarefas_categorias tc ON c.id = tc.categoria_id 
         WHERE tc.tarefa_id = t.id) as categorias_ids,
        (SELECT array_agg(c.nome) FROM categorias c 
         JOIN tarefas_categorias tc ON c.id = tc.categoria_id 
         WHERE tc.tarefa_id = t.id) as categorias_nomes
       FROM tarefas t 
       WHERE t.usuario_id = $1 
       ORDER BY 
         CASE 
           WHEN t.status = 'pendente' THEN 1 
           WHEN t.status = 'em_progresso' THEN 2 
           WHEN t.status = 'concluida' THEN 3 
           WHEN t.status = 'cancelada' THEN 4 
           ELSE 5 
         END,
         CASE 
           WHEN t.prioridade = 'Urgente' THEN 1 
           WHEN t.prioridade = 'Alta' THEN 2 
           WHEN t.prioridade = 'Media' THEN 3 
           WHEN t.prioridade = 'Baixa' THEN 4 
           ELSE 5 
         END,
         t.data_vencimento ASC NULLS LAST`,
      [usuario_id]
    );
    return result.rows;
  },

  // Buscar tarefa por ID
  async findById(id) {
    const result = await db.query(
      `SELECT t.*, 
        (SELECT array_agg(c.id) FROM categorias c 
         JOIN tarefas_categorias tc ON c.id = tc.categoria_id 
         WHERE tc.tarefa_id = t.id) as categorias_ids,
        (SELECT array_agg(c.nome) FROM categorias c 
         JOIN tarefas_categorias tc ON c.id = tc.categoria_id 
         WHERE tc.tarefa_id = t.id) as categorias_nomes 
       FROM tarefas t 
       WHERE t.id = $1`,
      [id]
    );
    return result.rows[0];
  },

  // Criar uma nova tarefa
  async create(usuario_id, titulo, descricao, status, prioridade, data_vencimento) {
    try {
      // Primeiro inserimos a tarefa
      const result = await db.query(
        `INSERT INTO tarefas 
        (usuario_id, titulo, descricao, status, prioridade, data_vencimento) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [usuario_id, titulo, descricao, status || 'pendente', prioridade || 'Media', data_vencimento]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  },

  // Atualizar uma tarefa existente
  async update(id, titulo, descricao, status, prioridade, data_vencimento) {
    const result = await db.query(
      `UPDATE tarefas 
       SET titulo = $1, descricao = $2, status = $3, prioridade = $4, data_vencimento = $5 
       WHERE id = $6 RETURNING *`,
      [titulo, descricao, status, prioridade, data_vencimento, id]
    );
    return result.rows[0];
  },

  // Deletar uma tarefa
  async delete(id) {
    await db.query('DELETE FROM tarefas WHERE id = $1', [id]);
  },

  // Associar tarefa a categorias
  async associarCategorias(tarefa_id, categorias_ids) {
    try {
      // Remove associações existentes
      await db.query('DELETE FROM tarefas_categorias WHERE tarefa_id = $1', [tarefa_id]);
      
      // Adiciona novas associações
      if (categorias_ids && categorias_ids.length > 0) {
        for (const categoria_id of categorias_ids) {
          await db.query(
            'INSERT INTO tarefas_categorias (tarefa_id, categoria_id) VALUES ($1, $2)',
            [tarefa_id, categoria_id]
          );
        }
      }
    } catch (error) {
      console.error('Erro ao associar categorias:', error);
      throw error;
    }
  },

  // Verificar se a tarefa pertence ao usuário
  async belongsToUser(tarefaId, usuarioId) {
    const result = await db.query(
      'SELECT COUNT(*) FROM tarefas WHERE id = $1 AND usuario_id = $2',
      [tarefaId, usuarioId]
    );
    return parseInt(result.rows[0].count) > 0;
  },

  // Filtrar tarefas por categoria
  async findByCategoria(usuario_id, categoria_id) {
    const result = await db.query(
      `SELECT t.*, 
        (SELECT array_agg(c.id) FROM categorias c 
         JOIN tarefas_categorias tc ON c.id = tc.categoria_id 
         WHERE tc.tarefa_id = t.id) as categorias_ids,
        (SELECT array_agg(c.nome) FROM categorias c 
         JOIN tarefas_categorias tc ON c.id = tc.categoria_id 
         WHERE tc.tarefa_id = t.id) as categorias_nomes
       FROM tarefas t 
       JOIN tarefas_categorias tc ON t.id = tc.tarefa_id
       WHERE t.usuario_id = $1 AND tc.categoria_id = $2
       ORDER BY t.data_vencimento ASC NULLS LAST, t.prioridade DESC`,
      [usuario_id, categoria_id]
    );
    return result.rows;
  },

  // Filtrar tarefas por status
  async findByStatus(usuario_id, status) {
    const result = await db.query(
      `SELECT t.*, 
        (SELECT array_agg(c.id) FROM categorias c 
         JOIN tarefas_categorias tc ON c.id = tc.categoria_id 
         WHERE tc.tarefa_id = t.id) as categorias_ids,
        (SELECT array_agg(c.nome) FROM categorias c 
         JOIN tarefas_categorias tc ON c.id = tc.categoria_id 
         WHERE tc.tarefa_id = t.id) as categorias_nomes
       FROM tarefas t 
       WHERE t.usuario_id = $1 AND t.status = $2
       ORDER BY t.data_vencimento ASC NULLS LAST, t.prioridade DESC`,
      [usuario_id, status]
    );
    return result.rows;
  }
};
