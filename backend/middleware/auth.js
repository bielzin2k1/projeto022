const jwt = require('jsonwebtoken');
const supabase = require('../db');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');

      // Get user from token
      const { data: user, error } = await supabase
        .from('profiles')
        .select('id, username, email, role, rank, status, actions_participated, victories, defeats, reputation, avatar')
        .eq('id', decoded.id)
        .single();

      if (error || !user) {
        return res.status(401).json({ message: 'Não autorizado, usuário não encontrado' });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ message: 'Não autorizado, token inválido' });
    }
  } else {
    res.status(401).json({ message: 'Não autorizado, sem token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Usuário com role ${req.user.role} não tem permissão para acessar esta rota` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
