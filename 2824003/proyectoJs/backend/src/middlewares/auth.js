// Middleware para proteger rutas. Verifica que el token JWT sea válido.
import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; 
      next();
    } catch (error) {
      return res.status(401).json({ message: 'No autorizado, token falló o expiró.' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'No autorizado, no se encontró token.' });
  }
};

export const admin = (req, res, next) => {
    if (req.user && req.user.rol === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Acceso denegado. Se requiere rol de administrador.' });
    }
};