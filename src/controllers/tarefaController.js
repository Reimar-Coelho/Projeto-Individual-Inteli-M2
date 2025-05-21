const Tarefa = require('../models/tarefaModel');
const SubTarefa = require('../models/subTarefaModel');
const Categoria = require('../models/categoriaModel');

// Listar todas as tarefas do usuário atual
exports.index = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    
    const tarefas = await Tarefa.findAllByUser(usuarioId);
    const categorias = await Categoria.findAllByUser(usuarioId);
    
    res.render('tarefas/index', { tarefas, categorias });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao listar tarefas' });
  }
};

// Filtrar tarefas por categoria
exports.filtrarPorCategoria = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    
    const { categoriaId } = req.params;
    const tarefas = await Tarefa.findByCategoria(usuarioId, categoriaId);
    const categorias = await Categoria.findAllByUser(usuarioId);
    
    res.render('tarefas/index', { tarefas, categorias, categoriaAtual: categoriaId });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao filtrar tarefas' });
  }
};

// Filtrar tarefas por status
exports.filtrarPorStatus = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    
    const { status } = req.params;
    const tarefas = await Tarefa.findByStatus(usuarioId, status);
    const categorias = await Categoria.findAllByUser(usuarioId);
    
    res.render('tarefas/index', { tarefas, categorias, statusAtual: status });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao filtrar tarefas' });
  }
};

// Detalhes de uma tarefa específica
exports.show = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const { id } = req.params;
    const tarefa = await Tarefa.findById(id);
    
    if (!tarefa) {
      return res.status(404).render('error', { error: 'Tarefa não encontrada' });
    }
    
    // Verificar se a tarefa pertence ao usuário atual
    const pertenceAoUsuario = await Tarefa.belongsToUser(id, usuarioId);
    
    if (!pertenceAoUsuario) {
      return res.status(403).render('error', { error: 'Acesso não autorizado' });
    }
    
    const subTarefas = await SubTarefa.findAllByTarefa(id);
    
    res.render('tarefas/show', { tarefa, subTarefas });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao carregar detalhes da tarefa' });
  }
};

// Formulário para criar tarefa
exports.createForm = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    
    const categorias = await Categoria.findAllByUser(usuarioId);
    
    res.render('tarefas/create', { categorias });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao carregar formulário de criação' });
  }
};

// Criar nova tarefa
exports.create = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    
    const { titulo, descricao, status, prioridade, data_vencimento, categorias_ids } = req.body;
    
    const tarefa = await Tarefa.create(
      usuarioId, 
      titulo, 
      descricao, 
      status || 'pendente', 
      prioridade || 'Media', 
      data_vencimento
    );
    
    // Associar categorias se fornecidas
    if (categorias_ids) {
      const categoriasArray = Array.isArray(categorias_ids) ? categorias_ids : [categorias_ids];
      await Tarefa.associarCategorias(tarefa.id, categoriasArray);
    }
    
    res.redirect('/tarefas');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao criar tarefa: ' + error.message });
  }
};

// Formulário para editar tarefa
exports.editForm = async (req, res) => {
  try {
    const { id } = req.params;
    const tarefa = await Tarefa.findById(id);
    
    if (!tarefa) {
      return res.status(404).render('error', { error: 'Tarefa não encontrada' });
    }
    
    // Verificar se a tarefa pertence ao usuário atual
    // const usuarioId = req.session.userId;
    // const pertenceAoUsuario = await Tarefa.belongsToUser(id, usuarioId);
    
    // if (!pertenceAoUsuario) {
    //   return res.status(403).render('error', { error: 'Acesso não autorizado' });
    // }
    
    const categorias = await Categoria.findAllByUser(tarefa.usuario_id);
    
    res.render('tarefas/edit', { tarefa, categorias });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao carregar formulário de edição' });
  }
};

// Atualizar tarefa
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descricao, status, prioridade, data_vencimento, categorias_ids } = req.body;
    
    // Verificar se a tarefa pertence ao usuário atual
    // const usuarioId = req.session.userId;
    // const pertenceAoUsuario = await Tarefa.belongsToUser(id, usuarioId);
    
    // if (!pertenceAoUsuario) {
    //   return res.status(403).render('error', { error: 'Acesso não autorizado' });
    // }
    
    await Tarefa.update(id, titulo, descricao, status, prioridade, data_vencimento);
    
    // Atualizar associação de categorias
    const categoriasArray = Array.isArray(categorias_ids) ? categorias_ids : (categorias_ids ? [categorias_ids] : []);
    await Tarefa.associarCategorias(id, categoriasArray);
    
    res.redirect(`/tarefas/${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao atualizar tarefa' });
  }
};

// Atualizar status da tarefa
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Verificar se a tarefa pertence ao usuário atual
    // const usuarioId = req.session.userId;
    // const pertenceAoUsuario = await Tarefa.belongsToUser(id, usuarioId);
    
    // if (!pertenceAoUsuario) {
    //   return res.status(403).render('error', { error: 'Acesso não autorizado' });
    // }
    
    const tarefa = await Tarefa.findById(id);
    await Tarefa.update(id, tarefa.titulo, tarefa.descricao, status, tarefa.prioridade, tarefa.data_vencimento);
    
    res.redirect(`/tarefas`);
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao atualizar status da tarefa' });
  }
};

// Excluir tarefa
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar se a tarefa pertence ao usuário atual
    // const usuarioId = req.session.userId;
    // const pertenceAoUsuario = await Tarefa.belongsToUser(id, usuarioId);
    
    // if (!pertenceAoUsuario) {
    //   return res.status(403).render('error', { error: 'Acesso não autorizado' });
    // }
    
    await Tarefa.delete(id);
    
    res.redirect('/tarefas');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao excluir tarefa' });
  }
};
