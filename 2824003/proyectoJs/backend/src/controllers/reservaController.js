import { Reserva } from '../models/Reserva.js';
import { Mantenimiento } from '../models/Mantenimiento.js';
// 1. Importamos el modelo de Notificacion
import { Notificacion } from '../models/Notificacion.js';

/**
 * Crea una nueva reserva.
 * (Esta función no necesita cambios)
 */
export const crearReserva = async (req, res, next) => {
  try {
    const { sala_id, motivo, fecha_inicio, fecha_fin } = req.body;
    const usuario_id = req.user.id;

    if (!sala_id || !motivo || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    if (new Date(fecha_inicio) >= new Date(fecha_fin)) {
      return res.status(400).json({ message: 'La fecha de fin debe ser posterior a la fecha de inicio.' });
    }

    const hayConflicto = await Mantenimiento.verificarConflictos(sala_id, fecha_inicio, fecha_fin);
    if (hayConflicto) {
      return res.status(409).json({ message: 'Conflicto de horario. La sala no está disponible en ese intervalo de tiempo (puede estar reservada o en mantenimiento).' });
    }

    const nuevaReserva = await Reserva.create({ motivo, sala_id, usuario_id, fecha_inicio, fecha_fin });
    res.status(201).json({ message: 'Reserva creada exitosamente', reserva: nuevaReserva });

  } catch (error) {
    console.error("Error en crearReserva:", error);
    next(error);
  }
};

/**
 * Lista las reservas.
 * (Esta función no necesita cambios)
 */
export const listarReservas = async (req, res, next) => {
  try {
    const { id: userId, rol } = req.user;
    let reservas;

    if (rol === 'admin' || rol === 'asistente') {
      reservas = await Reserva.findAll();
    } else {
      reservas = await Reserva.findByUserId(userId);
    }
    res.json(reservas);
  } catch (error) {
    console.error("Error en listarReservas:", error);
    next(error);
  }
};

/**
 * Cancela una reserva y notifica al usuario si es necesario.
 */
export const cancelarReserva = async (req, res, next) => {
  try {
    const { id: reservaId } = req.params;
    const { id: userId, rol } = req.user;

    const reserva = await Reserva.findById(reservaId);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }
    
    // --- LÓGICA DE NOTIFICACIÓN AÑADIDA ---
    // 2. Verificamos si el que cancela no es el dueño de la reserva
    const esAdminOAsistenteCancelando = (rol === 'admin' || rol === 'asistente') && reserva.usuario_id !== userId;

    if (esAdminOAsistenteCancelando) {
      // Si un admin/asistente cancela la reserva de otro, generamos una notificación
      await Notificacion.create({
        usuario_id: reserva.usuario_id, // La notificación es para el dueño original
        mensaje: `Tu reserva para la sala ha sido cancelada por un administrador.`,
        tipo: 'reserva_cancelada',
        reserva_id: reserva.id
      });
    }

    // 3. Verificamos permisos para cancelar (sin cambios en esta lógica)
    if (rol === 'admin' || rol === 'asistente' || reserva.usuario_id === userId) {
      await Reserva.cancelById(reservaId);
      res.status(200).json({ message: 'Reserva cancelada exitosamente.' });
    } else {
      return res.status(403).json({ message: 'No tienes permiso para cancelar esta reserva.' });
    }

  } catch (error) {
    console.error("Error en cancelarReserva:", error);
    next(error);
  }
};