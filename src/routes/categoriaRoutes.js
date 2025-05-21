const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoriaController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Proteger todas as rotas
router.use(isAuthenticated);

// Listar todas as categorias
router.get('/', controller.index);

// Criar categoria
router.get('/nova', controller.createForm);
router.post('/nova', controller.create);

// Editar categoria
router.get('/:id/editar', controller.editForm);
router.post('/:id/editar', controller.update);

// Excluir categoria
router.post('/:id/excluir', controller.delete);

module.exports = router;
