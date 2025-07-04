import Sala from '../models/Sala.js';

export const listarSalas = async (req, res, next) => {
    try {
        const salas = await Sala.getAll();
        if (!salas || salas.length === 0) {
            return res.status(200).json({ mensaje: "No hay salas registradas" });
        }
        res.json(salas);
    } catch (error) {
        console.error("Error en listarSalas:", error);
        next(error);
    }
};

// La nueva función para crear una sala
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
}

export const eliminarSala = async (req, res, next) => {
  try {
    // Obtenemos el ID que viene como parámetro en la URL (ej: /salas/7)
    const { id } = req.params;

    const resultado = await Sala.deleteById(id);

    // Si el resultado es 0, significa que no se encontró la sala con ese ID
    if (resultado === 0) {
      return res.status(404).json({ message: 'Sala no encontrada.' });
    }

    // Si todo sale bien, enviamos una confirmación.
    res.status(200).json({ message: 'Sala eliminada exitosamente.' });

  } catch (error) {
    console.error("Error en eliminarSala:", error);
    next(error);
  }
}
export const actualizarSala = async (req, res, next) => {
  try {
    const { id } = req.params;   // El ID de la sala a actualizar (de la URL)
    const salaData = req.body; // Los nuevos datos de la sala (del Body)

    // Validación simple para asegurar que los datos principales vengan
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
}
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