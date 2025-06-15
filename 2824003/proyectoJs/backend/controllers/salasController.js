import Sala from '../models/Sala.js';

export const listarSalas = async (req, res) => {
  try {
    console.log("Obteniendo salas desde DB...");
    const salas = await Sala.getAll();
    
    if (!salas || salas.length === 0) {
      return res.status(404).json({ mensaje: "No hay salas registradas" });
    }

    res.json(salas);
  } catch (error) {
    console.error("Error en listarSalas:", {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      error: "Error interno del servidor",
      detalle: error.message 
    });
  }
};