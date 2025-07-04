import { Dashboard } from '../models/Dashboard.js';

/**
 * Obtiene las estadísticas del dashboard y las envía como respuesta.
 */
export const getDashboardStats = async (req, res, next) => {
  try {
    // Llama a la función estática del modelo para obtener todas las estadísticas.
    const stats = await Dashboard.getStats();

    // Envía las estadísticas como una respuesta JSON.
    res.status(200).json(stats);

  } catch (error) {
    // Si algo sale mal, pasamos el error al manejador de errores central.
    console.error("Error en getDashboardStats:", error);
    next(error);
  }
};
