export const notFoundHandler = (_req, res) => {
  //для обробки неіснуючих маршрутів
  res.status(404).json({
    // відправляє відповідь з кодом 404 та повідомленням
    message: 'Route not found',
  });
};
