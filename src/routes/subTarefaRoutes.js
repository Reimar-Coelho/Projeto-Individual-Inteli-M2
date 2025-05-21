const express = require('express');
const router = express.Router();
const controller = require('../controllers/subTarefaController');

// Criar sub-tarefa
router.post('/tarefas/:tarefa_id/subtarefas', controller.create);

// Editar sub-tarefa
router.post('/tarefas/:tarefa_id/subtarefas/:id/editar', controller.update);

// Atualizar status
router.post('/tarefas/:tarefa_id/subtarefas/:id/status', controller.updateStatus);

// Excluir sub-tarefa
router.post('/tarefas/:tarefa_id/subtarefas/:id/excluir', controller.delete);

module.exports = router;
