import { Mantenimiento } from '../models/Mantenimiento.js';

/**
 * Crea un nuevo registro de mantenimiento.
 */
export const crearMantenimiento = async (req, res, next) => {
  try {
    const { sala_id, motivo, fecha_inicio, fecha_fin } = req.body;
    const creado_por_usuario_id = req.user.id;

    if (!sala_id || !motivo || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    if (new Date(fecha_inicio) >= new Date(fecha_fin)) {
      return res.status(400).json({ message: 'La fecha de fin debe ser posterior a la fecha de inicio.' });
    }
    const hayConflicto = await Mantenimiento.verificarConflictos(sala_id, fecha_inicio, fecha_fin);
    if (hayConflicto) {
      return res.status(409).json({ message: 'Conflicto de horario. Ya existe una reserva o mantenimiento en ese intervalo.' });
    }
    const nuevoMantenimiento = await Mantenimiento.create({ sala_id, motivo, fecha_inicio, fecha_fin, creado_por_usuario_id });
    res.status(201).json({ message: 'Mantenimiento programado exitosamente', mantenimiento: nuevoMantenimiento });
  } catch (error) {
    console.error("Error en crearMantenimiento:", error);
    next(error);
  }
};

/**
 * Lista todos los mantenimientos programados.
 */
export const listarMantenimientos = async (req, res, next) => {
  try {
    const mantenimientos = await Mantenimiento.findAll();
    res.json(mantenimientos);
  } catch (error) {
    console.error("Error en listarMantenimientos:", error);
    next(error);
  }
};

/**
 * Elimina un mantenimiento programado.
 */
export const eliminarMantenimiento = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await Mantenimiento.deleteById(id);
    if (resultado === 0) {
      return res.status(404).json({ message: 'Mantenimiento no encontrado.' });
    }
    res.status(200).json({ message: 'Mantenimiento eliminado exitosamente.' });
  } catch (error) {
    console.error("Error en eliminarMantenimiento:", error);
    next(error);
  }
};
