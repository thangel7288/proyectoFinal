import Sala from '../models/Sala.js';

/**
 * Lista todas las salas disponibles.
 * CORRECCIÓN: Ahora siempre devuelve un array.
 */
export const listarSalas = async (req, res, next) => {
  try {
    const salas = await Sala.getAll();
    // No importa si la lista está vacía, siempre devolvemos el array.
    // El frontend se encargará de mostrar el mensaje "No hay salas".
    res.json(salas || []); 
  } catch (error) {
    console.error("Error en listarSalas:", error);
    next(error);
  }
};

// --- OTRAS FUNCIONES DEL CONTROLADOR (SIN CAMBIOS) ---

export const crearSala = async (req, res, next) => {
  try {
    const { nombre, capacidad, ubicacion } = req.body;
    if (!nombre || !capacidad || !ubicacion) {
      return res.status(400).json({ mensaje: "Nombre, capacidad y ubicación son obligatorios." });
    }
    const nuevaSala = await Sala.create(req.body);
    res.status(201).json({ mensaje: "Sala creada con éxito", sala: nuevaSala });
  } catch (error) {
    console.error("Error en crearSala:", error);
    next(error);
  }
};

export const eliminarSala = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await Sala.deleteById(id);
    if (resultado === 0) {
      return res.status(404).json({ message: 'Sala no encontrada.' });
    }
    res.status(200).json({ message: 'Sala eliminada exitosamente.' });
  } catch (error) {
    console.error("Error en eliminarSala:", error);
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

export const getSalaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sala = await Sala.findById(id);
    if (!sala) {
      return res.status(404).json({ message: 'Sala no encontrada.' });
    }
    res.json(sala);
  } catch (error) {
    next(error);
  }
};