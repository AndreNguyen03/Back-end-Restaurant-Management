import { ReasonPhrases, StatusCodes } from "../utils/httpStatusCode.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;

  return res.status(statusCode).json({
    status: statusCode,
    message: message,
  });
};

export default errorHandler;
