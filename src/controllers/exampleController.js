const User = require('../models/exampleModel');

// Listar todos os usuários
exports.index = async (req, res) => {
  const users = await User.findAll();
  res.render('example/index', { users });
};

// Criar novo usuário
exports.create = async (req, res) => {
  const { nome, email } = req.body;
  await User.create(nome, email);
  res.redirect('/users');
};

// Atualizar dados do usuário
exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;
  await User.update(id, nome, email);
  res.redirect('/users');
};

// Deletar usuário
exports.delete = async (req, res) => {
  const { id } = req.params;
  await Professor.delete(id);
  res.redirect('/users');
};