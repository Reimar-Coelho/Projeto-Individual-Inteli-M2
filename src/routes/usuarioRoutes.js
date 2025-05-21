const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuarioController');

// Rota raiz - listar todos os usuários
router.get('/', controller.listarUsuarios);

// Rotas de autenticação
router.get('/login', controller.loginForm);
router.post('/login', controller.login);
router.get('/registro', controller.registroForm);
router.post('/registro', controller.registro);
router.get('/logout', controller.logout);

// Rotas de perfil
router.get('/perfil', controller.perfil);
router.get('/perfil/editar', controller.editarPerfilForm);
router.post('/perfil/editar', controller.atualizarPerfil);

module.exports = router;
