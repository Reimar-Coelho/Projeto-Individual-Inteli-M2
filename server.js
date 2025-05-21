require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Configuração das sessões
app.use(session({
  secret: process.env.SESSION_SECRET || 'sua-chave-secreta-padrao',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Configurando pasta de arquivos estáticos
app.use(express.static('public'));
app.use('/css', express.static(path.join(__dirname, 'src/views/css')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Middleware para disponibilizar dados do usuário em todas as views
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  res.locals.isLoggedIn = !!req.session.usuario;
  next();
});

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

// Middleware para lidar com erros de rota não encontrada
app.use((req, res, next) => {
  res.status(404).send('Página não encontrada');
});

// Middleware para lidar com erros internos do servidor
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erro no servidor');
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
