export const globalErrorHandler = (error, req, res, next) => {
  return res.status(error.cause?.status || 500).json({
    status: error.cause?.status || 500,
    message: error.message || 'Internal Server Error',
    error: error.cause?.errors || undefined,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};
