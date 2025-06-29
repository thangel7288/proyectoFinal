// middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message 
  });
};

// Exportación nombrada (coincide con el import en app.js)
export { errorHandler };