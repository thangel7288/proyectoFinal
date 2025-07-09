import { Reserva } from '../models/Reserva.js';
import { Mantenimiento } from '../models/Mantenimiento.js';
import { Notificacion } from '../models/Notificacion.js';
import { Sala } from '../models/Sala.js';

/**
 * Crea una nueva reserva.
 * Verifica conflictos con otras reservas Y con mantenimientos.
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

    // --- VERIFICACIÓN CLAVE ---
    // Usamos la función del modelo de Mantenimiento que ya es lo suficientemente
    // inteligente como para buscar conflictos en AMBAS tablas (reservas y mantenimientos).
    const hayConflicto = await Mantenimiento.verificarConflictos(sala_id, fecha_inicio, fecha_fin);
    if (hayConflicto) {
      return res.status(409).json({ message: 'Conflicto de horario. La sala no está disponible en ese intervalo (puede estar reservada o en mantenimiento).' });
    }

    // Si no hay conflictos, se procede a crear la reserva.
    const nuevaReserva = await Reserva.create({ motivo, sala_id, usuario_id, fecha_inicio, fecha_fin });
    
    // Notificamos al usuario que su reserva fue exitosa.
    const sala = await Sala.findById(sala_id);
    if (sala) {
      await Notificacion.create({
        usuario_id: usuario_id,
        mensaje: `Tu reserva para la sala "${sala.nombre}" ha sido confirmada.`,
        tipo: 'info_general',
        reserva_id: nuevaReserva.id
      });
    }

    res.status(201).json({ message: 'Reserva creada exitosamente', reserva: nuevaReserva });

  } catch (error) {
    console.error("Error en crearReserva:", error);
    next(error);
  }
};

// --- OTRAS FUNCIONES (listarReservas, cancelarReserva) ---

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

export const cancelarReserva = async (req, res, next) => {
  try {
    const { id: reservaId } = req.params;
    const { id: userId, rol } = req.user;
    const reserva = await Reserva.findById(reservaId);
    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }
    const esAdminOAsistenteCancelando = (rol === 'admin' || rol === 'asistente') && reserva.usuario_id !== userId;
    if (esAdminOAsistenteCancelando) {
      const sala = await Sala.findById(reserva.sala_id);
      await Notificacion.create({
        usuario_id: reserva.usuario_id,
        mensaje: `Tu reserva para la sala "${sala ? sala.nombre : ''}" ha sido cancelada por un administrador.`,
        tipo: 'reserva_cancelada',
        reserva_id: reserva.id
      });
    }
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
