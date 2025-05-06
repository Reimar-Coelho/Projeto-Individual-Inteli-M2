const express = require('express');
const router = express.Router();

// Exemplo de rota
router.get('/', (req, res) => {
  res.send('Bem-vindo à API!');
});

module.exports = router;