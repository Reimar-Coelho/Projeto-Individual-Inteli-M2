module.exports = {
  // Verificar se o usuário está logado
  isAuthenticated: (req, res, next) => {
    if (req.session.usuario) {
      return next();
    }
    
    // Salvar a URL que o usuário estava tentando acessar
    req.session.returnTo = req.originalUrl;
    
    req.session.flash = {
      type: 'danger',
      message: 'Você precisa estar logado para acessar esta página'
    };
    
    res.redirect('/usuarios/login');
  }
};
