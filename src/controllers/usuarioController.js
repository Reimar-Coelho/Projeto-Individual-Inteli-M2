const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcrypt');

// Listar todos os usuários
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.render('usuarios/index', { usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao listar usuários' });
  }
};

// Página de login
exports.loginForm = (req, res) => {
  const flash = req.session.flash;
  delete req.session.flash;
  
  res.render('usuarios/login', { error: flash?.message });
};

// Processar login
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  
  try {
    const usuario = await Usuario.findByEmail(email);
    
    if (!usuario) {
      return res.render('usuarios/login', { 
        error: 'Email não encontrado', 
        email 
      });
    }
    
    // Verificar se a senha é válida
    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    
    if (!senhaValida) {
      return res.render('usuarios/login', { 
        error: 'Senha incorreta', 
        email 
      });
    }
    
    // Armazenar dados do usuário na sessão (exceto a senha)
    req.session.usuario = {
      id: usuario.id,
      nome: usuario.nome_usuario,
      email: usuario.email
    };
    
    // Redirecionar para a página anterior ou tarefas
    const returnTo = req.session.returnTo || '/';
    delete req.session.returnTo;
    
    res.redirect(returnTo);
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao fazer login' });
  }
};

// Página de registro
exports.registroForm = (req, res) => {
  res.render('usuarios/registro');
};

// Processar registro
exports.registro = async (req, res) => {
  const { nome_usuario, email, senha, confirmar_senha } = req.body;
  
  try {
    // Validações
    if (senha !== confirmar_senha) {
      return res.render('usuarios/registro', { 
        error: 'As senhas não coincidem', 
        nome_usuario, 
        email 
      });
    }
    
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      return res.render('usuarios/registro', { 
        error: 'Email já cadastrado', 
        nome_usuario 
      });
    }
    
    const usernameExistente = await Usuario.findByUsername(nome_usuario);
    if (usernameExistente) {
      return res.render('usuarios/registro', { 
        error: 'Nome de usuário já em uso', 
        email 
      });
    }
    
    // Gerar hash da senha
    const salt = await bcrypt.genSalt(10);
    const senha_hash = await bcrypt.hash(senha, salt);
    
    // Criar o usuário
    const novoUsuario = await Usuario.create(nome_usuario, email, senha_hash);
    
    // Login automático após registro
    req.session.usuario = {
      id: novoUsuario.id,
      nome: novoUsuario.nome_usuario,
      email: novoUsuario.email
    };
    
    res.redirect('/tarefas');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao registrar usuário' });
  }
};

// Perfil do usuário
exports.perfil = async (req, res) => {
  try {
    if (!req.session.usuario) {
      return res.redirect('/usuarios/login');
    }
    
    const usuarioId = req.session.usuario.id;
    const usuario = await Usuario.findById(usuarioId);
    
    if (!usuario) {
      return res.status(404).render('error', { error: 'Usuário não encontrado' });
    }
    
    res.render('usuarios/perfil', { usuario });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao carregar perfil' });
  }
};

// Formulário de edição do perfil
exports.editarPerfilForm = async (req, res) => {
  try {
    if (!req.session.usuario) {
      return res.redirect('/usuarios/login');
    }
    
    const usuarioId = req.session.usuario.id;
    const usuario = await Usuario.findById(usuarioId);
    
    if (!usuario) {
      return res.status(404).render('error', { error: 'Usuário não encontrado' });
    }
    
    res.render('usuarios/editar', { usuario });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao carregar formulário de edição' });
  }
};

// Processar edição do perfil
exports.atualizarPerfil = async (req, res) => {
  try {
    if (!req.session.usuario) {
      return res.redirect('/usuarios/login');
    }
    
    const usuarioId = req.session.usuario.id;
    const { nome_usuario, email } = req.body;
    
    const usuarioAtualizado = await Usuario.update(usuarioId, nome_usuario, email);
    
    // Atualizar dados na sessão
    req.session.usuario.nome = usuarioAtualizado.nome_usuario;
    req.session.usuario.email = usuarioAtualizado.email;
    
    res.redirect('/usuarios/perfil');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Erro ao atualizar perfil' });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};
