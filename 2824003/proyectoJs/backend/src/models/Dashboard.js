import { pool } from '../config/database.js';

export class Dashboard {

  /**
   * Obtiene un conjunto de estadísticas clave de la base de datos.
   * Ejecuta múltiples consultas en paralelo para mayor eficiencia.
   */
  static async getStats() {
    try {
      // Definimos todas las consultas que necesitamos
      const totalUsuariosQuery = pool.query("SELECT COUNT(*) as total FROM usuarios");
      const totalSalasQuery = pool.query("SELECT COUNT(*) as total FROM salas");
      const reservasActivasQuery = pool.query(
        "SELECT COUNT(*) as total FROM reservas WHERE estado = 'confirmada' AND fecha_inicio >= NOW()"
      );
      
      const salaMasReservadaQuery = pool.query(`
        SELECT s.nombre, COUNT(r.id) AS total_reservas 
        FROM reservas r
        JOIN salas s ON r.sala_id = s.id
        GROUP BY s.nombre 
        ORDER BY total_reservas DESC 
        LIMIT 1
      `);

      const actividadRecienteQuery = pool.query(`
        SELECT 
          r.motivo, 
          s.nombre AS sala_nombre, 
          CONCAT(u.nombre, ' ', u.apellido) AS usuario_nombre,
          r.fecha_inicio
        FROM reservas r
        JOIN salas s ON r.sala_id = s.id
        JOIN usuarios u ON r.usuario_id = u.id
        ORDER BY r.fecha_creacion DESC
        LIMIT 5
      `);

      // Ejecutamos todas las consultas en paralelo
      const [
        [totalUsuariosRows],
        [totalSalasRows],
        [reservasActivasRows],
        [salaMasReservadaRows],
        [actividadRecienteRows]
      ] = await Promise.all([
        totalUsuariosQuery,
        totalSalasQuery,
        reservasActivasQuery,
        salaMasReservadaQuery,
        actividadRecienteQuery
      ]);

      // Estructuramos la respuesta final
      const stats = {
        totalUsuarios: totalUsuariosRows[0].total,
        totalSalas: totalSalasRows[0].total,
        reservasActivas: reservasActivasRows[0].total,
        salaMasReservada: salaMasReservadaRows.length > 0 ? salaMasReservadaRows[0].nombre : 'N/A',
        actividadReciente: actividadRecienteRows
      };

      return stats;

    } catch (error) {
      console.error("Error al obtener estadísticas del dashboard:", error);
      throw error;
    }
  }
}
