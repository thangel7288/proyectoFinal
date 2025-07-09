import { Sala } from '../models/Sala.js';
import { Auditoria } from '../models/Auditoria.js';

/**
 * Lista todas las salas activas.
 */
export const listarSalas = async (req, res, next) => {
  try {
    const salas = await Sala.getAll();
    res.json(salas || []);
  } catch (error) {
    console.error("Error en listarSalas:", error);
    next(error);
  }
};

/**
 * Crea una nueva sala.
 */
export const crearSala = async (req, res, next) => {
  try {
    const { nombre, capacidad, ubicacion, equipamiento } = req.body;
    if (!nombre || !capacidad) {
      return res.status(400).json({ mensaje: "Nombre y capacidad son obligatorios." });
    }
    const nuevaSala = await Sala.create({ nombre, capacidad, ubicacion, equipamiento });
    res.status(201).json({ mensaje: "Sala creada con éxito", sala: nuevaSala });
  } catch (error) {
    console.error("Error en crearSala:", error);
    next(error);
  }
};

/**
 * Actualiza una sala existente.
 */
export const actualizarSala = async (req, res, next) => {
  try {
    const { id } = req.params;
    const salaData = req.body;
    if (!salaData.nombre || !salaData.capacidad) {
      return res.status(400).json({ message: 'Nombre y capacidad son obligatorios.' });
    }
    const resultado = await Sala.updateById(id, salaData);
    if (resultado === 0) {
      return res.status(404).json({ message: 'Sala no encontrada.' });
    }
    res.status(200).json({ message: 'Sala actualizada exitosamente.' });
  } catch (error) {
    console.error("Error en actualizarSala:", error);
    next(error);
  }
};

/**
 * Obtiene los detalles de una sala específica.
 */
export const getSalaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sala = await Sala.findById(id);
    if (!sala) {
      return res.status(404).json({ message: 'Sala no encontrada.' });
    }
    res.json(sala);
  } catch (error) {
    console.error("Error en getSalaById:", error);
    next(error);
  }
};

/**
 * Desactiva una sala (soft delete) si no tiene reservas activas.
 */
export const desactivarSala = async (req, res, next) => {
  try {
    const { id: salaId } = req.params;
    const adminId = req.user.id;

    // 1. Verificamos si la sala tiene reservas ACTIVAS.
    const tieneReservasActivas = await Sala.tieneReservasActivas(salaId);
    if (tieneReservasActivas) {
      return res.status(409).json({ message: 'No se puede archivar la sala porque tiene reservas activas. Por favor, cancele las reservas primero.' });
    }

    // 2. Obtenemos el nombre de la sala ANTES de desactivarla para usarlo en el log.
    const sala = await Sala.findById(salaId);
    if (!sala) {
      return res.status(404).json({ message: 'Sala no encontrada.' });
    }

    // 3. Desactivamos la sala.
    await Sala.desactivarById(salaId);

    // 4. Registramos la acción en la tabla de auditoría.
    await Auditoria.create({
      usuario_id: adminId,
      accion: `La sala '${sala.nombre}' ha sido archivada.`
    });

    res.status(200).json({ message: 'Sala archivada exitosamente.' });

  } catch (error) {
    console.error("Error en desactivarSala:", error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};