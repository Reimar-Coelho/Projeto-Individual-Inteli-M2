const express = require('express');
const router = express.Router();
const controller = require('../controllers/tarefaController');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Proteger todas as rotas
router.use(isAuthenticated);

// Listar todas as tarefas
router.get('/', controller.index);

// Filtros
router.get('/categoria/:categoriaId', controller.filtrarPorCategoria);
router.get('/status/:status', controller.filtrarPorStatus);

// Criar tarefa
router.get('/nova', controller.createForm);
router.post('/nova', controller.create);

// Detalhes da tarefa
router.get('/:id', controller.show);

// Editar tarefa
router.get('/:id/editar', controller.editForm);
router.post('/:id/editar', controller.update);

// Atualizar status
router.post('/:id/status', controller.updateStatus);

// Excluir tarefa
router.post('/:id/excluir', controller.delete);

module.exports = router;
