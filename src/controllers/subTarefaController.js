const SubTarefa = require('../models/subTarefaModel');
const Tarefa = require('../models/tarefaModel');

// Adicionar sub-tarefa
exports.create = async (req, res) => {
  try {
    const { tarefa_id } = req.params;
    const { titulo } = req.body;
    
    // Verificar se a tarefa pai pertence ao usuário atual
    // const usuarioId = req.session.userId;
    // const pertenceAoUsuario = await Tarefa.belongsToUser(tarefa_id, usuarioId);
    
    // if (!pertenceAoUsuario) {
    //   return res.status(403).render('error', { error: 'Acesso não autorizado' });
    // }
    
    await SubTarefa.create(tarefa_id, titulo);
    
    res.redirect(`/tarefas/${tarefa_id}`);
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao criar sub-tarefa' });
  }
};

// Atualizar sub-tarefa
exports.update = async (req, res) => {
  try {
    const { id, tarefa_id } = req.params;
    const { titulo, status } = req.body;
    
    // Verificar se a tarefa pai pertence ao usuário atual
    // const usuarioId = req.session.userId;
    // const pertenceAoUsuario = await Tarefa.belongsToUser(tarefa_id, usuarioId);
    
    // if (!pertenceAoUsuario || !await SubTarefa.belongsToTarefa(id, tarefa_id)) {
    //   return res.status(403).render('error', { error: 'Acesso não autorizado' });
    // }
    
    await SubTarefa.update(id, titulo, status);
    
    res.redirect(`/tarefas/${tarefa_id}`);
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao atualizar sub-tarefa' });
  }
};

// Atualizar status da sub-tarefa
exports.updateStatus = async (req, res) => {
  try {
    const { id, tarefa_id } = req.params;
    const { status } = req.body;
    
    // Verificar se a tarefa pai pertence ao usuário atual
    // const usuarioId = req.session.userId;
    // const pertenceAoUsuario = await Tarefa.belongsToUser(tarefa_id, usuarioId);
    
    // if (!pertenceAoUsuario || !await SubTarefa.belongsToTarefa(id, tarefa_id)) {
    //   return res.status(403).render('error', { error: 'Acesso não autorizado' });
    // }
    
    await SubTarefa.updateStatus(id, status);
    
    res.redirect(`/tarefas/${tarefa_id}`);
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao atualizar status da sub-tarefa' });
  }
};

// Excluir sub-tarefa
exports.delete = async (req, res) => {
  try {
    const { id, tarefa_id } = req.params;
    
    // Verificar se a tarefa pai pertence ao usuário atual
    // const usuarioId = req.session.userId;
    // const pertenceAoUsuario = await Tarefa.belongsToUser(tarefa_id, usuarioId);
    
    // if (!pertenceAoUsuario || !await SubTarefa.belongsToTarefa(id, tarefa_id)) {
    //   return res.status(403).render('error', { error: 'Acesso não autorizado' });
    // }
    
    await SubTarefa.delete(id);
    
    res.redirect(`/tarefas/${tarefa_id}`);
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao excluir sub-tarefa' });
  }
};
