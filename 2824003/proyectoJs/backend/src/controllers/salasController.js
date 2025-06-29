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
};