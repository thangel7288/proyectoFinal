import { User } from '../models/User.js'; // CORRECCIÓN: Se usan llaves {}
import bcrypt from 'bcryptjs';

// Función para validar el formato del email
const isValidEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// 1. LISTAR TODOS LOS USUARIOS (sin cambios)
export const listarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await User.getAllWithRole();
    res.json(usuarios);
  } catch (error) {
    console.error("Error en listarUsuarios:", error);
    next(error);
  }
};

// 2. OBTENER UN USUARIO POR SU ID (sin cambios)
export const obtenerUsuarioPorId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuario = await User.findById(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    const { password_hash, ...userSinPassword } = usuario;
    res.json(userSinPassword);
  } catch (error) {
    console.error("Error en obtenerUsuarioPorId:", error);
    next(error);
  }
};

// 3. CREAR UN NUEVO USUARIO (con validaciones mejoradas)
export const crearUsuario = async (req, res, next) => {
  try {
    const { nombre, apellido, email, password, rol_id } = req.body;

    // --- VALIDACIONES DEL BACKEND ---
    if (!nombre || !apellido || !email || !password || !rol_id) {
      return res.status(400).json({ message: "Todos los campos son obligatorios." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "El formato del correo electrónico no es válido." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres." });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const nuevoUsuario = await User.create({ nombre, apellido, email, password_hash, rol_id });
    res.status(201).json({ message: "Usuario creado con éxito", usuario: nuevoUsuario });

  } catch (error) {
    console.error("Error en crearUsuario:", error);
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
    }
    next(error);
  }
};

// 4. ACTUALIZAR UN USUARIO (con validaciones mejoradas)
export const actualizarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, rol_id } = req.body;

    if (!nombre || !apellido || !email || !rol_id) {
        return res.status(400).json({ message: "Nombre, apellido, email y rol son obligatorios." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "El formato del correo electrónico no es válido." });
    }

    const resultado = await User.updateById(id, { nombre, apellido, email, rol_id });

    if (resultado === 0) {
      return res.status(404).json({ message: 'Sala no encontrada.' });
    }
    res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
  } catch (error) {
    console.error("Error en actualizarUsuario:", error);
    if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'El correo electrónico ya está en uso por otro usuario.' });
    }
    next(error);
  }
};

// 5. ELIMINAR UN USUARIO (sin cambios)
export const eliminarUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await User.deleteById(id);
    if (resultado === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }
    res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    console.error("Error en eliminarUsuario:", error);
    next(error);
  }
};