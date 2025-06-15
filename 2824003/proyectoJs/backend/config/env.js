import dotenv from 'dotenv';
dotenv.config();

// Configuración validada
const config = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'reservas_salas',
  PORT: process.env.PORT || 3001
};

export { config }; // Exportación nombrada