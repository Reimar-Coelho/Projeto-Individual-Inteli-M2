const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

require('dotenv').config();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Importar rotas
const usuarioRoutes = require('./src/routes/usuarioRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');
const tarefaRoutes = require('./src/routes/tarefaRoutes');
const subTarefaRoutes = require('./src/routes/subTarefaRoutes');

// Definir rotas
app.use('/usuarios', usuarioRoutes);
app.use('/categorias', categoriaRoutes);
app.use('/tarefas', tarefaRoutes);
app.use('/', subTarefaRoutes); // As rotas de sub-tarefas já incluem o prefixo completo

// Rota principal
app.get('/', (req, res) => {
  res.render('home');
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});