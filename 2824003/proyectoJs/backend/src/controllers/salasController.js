import { Sala } from '../models/Sala.js';
import { Auditoria } from '../models/Auditoria.js';

export const listarSalas = async (req, res, next) => {
  try {
    const salas = await Sala.getAll(); // Esto ya solo obtiene salas activas
    res.json(salas || []);
  } catch (error) {
    console.error("Error en listarSalas:", error);
    next(error);
  }
};

export const listarSalasInactivas = async (req, res, next) => {
  try {
    const salas = await Sala.getAllInactive();
    res.json(salas || []);
  } catch (error) {
    console.error("Error en listarSalasInactivas:", error);
    next(error);
  }
};

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

export const crearSala = async (req, res, next) => {
  try {
    const { nombre, capacidad, ubicacion } = req.body;
    if (!nombre || !capacidad || !ubicacion) {
      return res.status(400).json({ mensaje: "Nombre, capacidad y ubicación son obligatorios." });
    }
    if (parseInt(capacidad, 10) <= 0) {
      return res.status(400).json({ message: "La capacidad debe ser un número positivo." });
    }
    const nuevaSala = await Sala.create({ nombre, capacidad, ubicacion });
    res.status(201).json({ mensaje: "Sala creada con éxito", sala: nuevaSala });
  } catch (error) {
    console.error("Error en crearSala:", error);
    next(error);
  }
};

export const actualizarSala = async (req, res, next) => {
  try {
    const { id } = req.params;
    const salaData = req.body;
    if (!salaData.nombre || !salaData.capacidad || !salaData.ubicacion) {
      return res.status(400).json({ message: 'Nombre, capacidad y ubicación son obligatorios.' });
    }
    if (parseInt(salaData.capacidad, 10) <= 0) {
      return res.status(400).json({ message: "La capacidad debe ser un número positivo." });
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

export const desactivarSala = async (req, res, next) => {
  try {
    const { id: salaId } = req.params;
    const adminId = req.user.id;

    const tieneReservasActivas = await Sala.tieneReservasActivas(salaId);
    if (tieneReservasActivas) {
      return res.status(409).json({ message: 'No se puede desactivar la sala porque tiene reservas activas. Por favor, cancele las reservas primero.' });
    }

    const tieneMantenimientosActivos = await Sala.tieneMantenimientosActivos(salaId);
    if (tieneMantenimientosActivos) {
      return res.status(409).json({ message: 'No se puede desactivar la sala porque tiene mantenimientos programados. Por favor, complete o elimine los mantenimientos primero.' });
    }

    const sala = await Sala.findById(salaId);
    if (!sala) {
      return res.status(404).json({ message: 'Sala no encontrada.' });
    }

    await Sala.deactivateById(salaId);

    await Auditoria.create({
      usuario_id: adminId,
      accion: `La sala '${sala.nombre}' ha sido desactivada.`
    });

    res.status(200).json({ message: 'Sala desactivada exitosamente.' });

  } catch (error) {
    console.error("Error en desactivarSala:", error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

export const reactivarSala = async (req, res, next) => {
  try {
    const { id: salaId } = req.params;
    const adminId = req.user.id;

    const resultado = await Sala.reactivateById(salaId);
    if (resultado === 0) {
        return res.status(404).json({ message: 'Sala no encontrada o ya está activa.' });
    }

    const sala = await Sala.findById(salaId);

    await Auditoria.create({
        usuario_id: adminId,
        accion: `La sala '${sala.nombre}' ha sido reactivada.`
    });

    res.status(200).json({ message: 'Sala reactivada exitosamente.' });

  } catch (error) {
      console.error("Error en reactivarSala:", error);
      res.status(500).json({ message: 'Error interno del servidor.' });
  }
};