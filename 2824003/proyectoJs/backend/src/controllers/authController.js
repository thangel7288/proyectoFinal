import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// --- FUNCIÓN DE LOGIN (CORREGIDA) ---
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Por favor, ingrese email y contraseña.' });
    }

    // 1. Buscamos al usuario y su rol usando la función que corregimos antes
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // 2. Comparamos la contraseña
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // --- ESTA ES LA PARTE CRÍTICA CORREGIDA ---
    // 3. Creamos el payload del token, asegurándonos de incluir el rol
    const payload = {
      id: user.id,
      nombre: user.nombre,
      rol: user.rol // La propiedad 'rol' viene de la consulta a la BD
    };

    // 4. Firmamos el token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h' // El token expira en 1 hora
    });

    // 5. Enviamos la respuesta, incluyendo el rol en el objeto de usuario
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol // Enviamos el rol al frontend
      }
    });

  } catch (error) {
    console.error("Error en el login:", error);
    next(error);
  }
};
