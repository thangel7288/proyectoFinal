// Contiene la lógica para el registro y el login.
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {
  try {
    const { email, password, nombre, apellido, rol } = req.body;
    if (!email || !password || !nombre || !apellido) {
        return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    const newUser = await User.create({ email, password_hash, nombre, apellido, rol });
    res.status(201).json({ message: 'Usuario registrado con éxito.', userId: newUser.id });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "El email y la contraseña son obligatorios." });
    }
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const isMatch = await User.comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales inválidas.' });
    }
    const payload = { userId: user.id, email: user.email, rol: user.rol };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
        message: 'Inicio de sesión exitoso.',
        token,
        user: { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol }
    });
  } catch (error) {
    next(error);
  }
};