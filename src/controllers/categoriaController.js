const Categoria = require('../models/categoriaModel');

// Listar todas as categorias do usuário atual
exports.index = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    
    const categorias = await Categoria.findAllByUser(usuarioId);
    
    res.render('categorias/index', { categorias });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao listar categorias' });
  }
};

// Formulário para criar categoria
exports.createForm = (req, res) => {
  res.render('categorias/create');
};

// Criar nova categoria
exports.create = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    
    const { nome } = req.body;
    
    await Categoria.create(nome, usuarioId);
    
    res.redirect('/categorias');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao criar categoria' });
  }
};

// Formulário para editar categoria
exports.editForm = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const { id } = req.params;
    
    const categoria = await Categoria.findById(id);
    
    if (!categoria) {
      return res.status(404).render('error', { error: 'Categoria não encontrada' });
    }
    
    // Verificar se a categoria pertence ao usuário atual
    const pertenceAoUsuario = await Categoria.belongsToUser(id, usuarioId);
    
    if (!pertenceAoUsuario) {
      return res.status(403).render('error', { error: 'Acesso não autorizado' });
    }
    
    res.render('categorias/edit', { categoria });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao carregar formulário de edição' });
  }
};

// Atualizar categoria
exports.update = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const { id } = req.params;
    const { nome } = req.body;
    
    // Verificar se a categoria pertence ao usuário atual
    const pertenceAoUsuario = await Categoria.belongsToUser(id, usuarioId);
    
    if (!pertenceAoUsuario) {
      return res.status(403).render('error', { error: 'Acesso não autorizado' });
    }
    
    await Categoria.update(id, nome);
    
    res.redirect('/categorias');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao atualizar categoria' });
  }
};

// Excluir categoria
exports.delete = async (req, res) => {
  try {
    const usuarioId = req.session.usuario.id;
    const { id } = req.params;
    
    // Verificar se a categoria pertence ao usuário atual
    const pertenceAoUsuario = await Categoria.belongsToUser(id, usuarioId);
    
    if (!pertenceAoUsuario) {
      return res.status(403).render('error', { error: 'Acesso não autorizado' });
    }
    
    await Categoria.delete(id);
    
    res.redirect('/categorias');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao excluir categoria' });
  }
};
