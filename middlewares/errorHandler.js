import { ReasonPhrases, StatusCodes } from "../utils/httpStatusCode.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = err.message || ReasonPhrases.INTERNAL_SERVER_ERROR;
  const stackTrace = err.stack;

  console.log(`stackTrace ::: `, stackTrace);

  return res.status(statusCode).json({
    status: statusCode,
    message: message,
    stack: stackTrace,
  });
};

export default errorHandler;
