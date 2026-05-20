//  404 Not Found Middleware

import { ApiError } from "../utils/ApiError.js";

const notFoundHandler = (req, res, next) => {
  const error = new ApiError(
    404,
    `Route not found: ${req.method} ${req.originalUrl}`
  );
  next(error);
};

export { notFoundHandler };