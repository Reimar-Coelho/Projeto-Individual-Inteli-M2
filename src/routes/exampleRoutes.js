
const express = require('express');
const router = express.Router();
const controller = require('../controllers/exampleController');

// Rota principal
router.get('/', controller.index);

// Criar novo usuário
router.post('/', controller.create);

// Editar usuário
router.post('/edit/:id', controller.update);

// Deletar usuário
router.post('/delete/:id', controller.delete);

module.exports = router;