import jwt from 'jsonwebtoken';
// ... otros imports si los tienes

// Esta función ya la tenías
export const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Guardamos los datos del token en la petición
      next();
    } catch (error) {
      return res.status(401).json({ message: 'No autorizado, token falló o expiró.' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no hay token.' });
  }
};
export const authorize = (...roles) => {
  return (req, res, next) => {
    // 'roles' será un array, ej: ['admin', 'asistente']
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes los permisos necesarios.' });
    }
    next();
  };
};

// Esta es la función que acabamos de añadir
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
  }
};
