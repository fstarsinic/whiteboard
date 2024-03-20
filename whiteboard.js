const pino = require('pino');
const moment = require('moment');
const log = pino({});

log.customError = (error, details = '', LogLevel = process.env.LOG_LEVEL) => {
  // We can manage universal data using globals
  const req = global.reqInfo;
  // The error is parsed in a new Error(error: the error passed to this function)
  const e = new Error(error);
  // The error frame from origin error's stack
  const frame = e.stack.split('\n')[2];
  // the function where the error occured
  const functionName = frame.split(' ')[5];
  // The exact line number
  const lineNumber = frame.split(':').reverse()[1];
  // The final object to be logged in the console
  const errorInfo = {
    // If we have a request object then parse it otherwise it is null
    reqInfo: req
      ? {
          req: {
            req: req.method,
            path: req.path,
            body: req.body,
            query: req.query,
          },
          // If a req has a property with key user then extract relevant information otherwise return null
          user: req.user
            ? {
                id: req.user.id,
                name: req.user.name,
              }
            : null,
          // The server information at the moment of error handling
          server: {
            ip: req.ip,
            servertime: moment().format('YYYY-MM-DD HH:mm:ss'),
          },
        }
      : null,
    functionName,
    lineNumber,
    // Assuming that error is occured in application layer and not the database end.
    errorType: 'application error',
    stack: error.stack || e.stack,
    message: error.message || e.message,
    env: process.env.NODE_ENV,
    // defaults read from environment variable
    logLevel: LogLevel,
    process: details,
  };
  // Print appropriate level of log from [info, debug, warn, error]
  switch (LogLevel) {
    case 'info':
      log.info(errorInfo);
      break;
    case 'debug':
      log.debug(errorInfo);
      break;
    case 'warn':
      log.warn(errorInfo);
      break;
    case 'error':
      log.error(errorInfo);
      break;
    default:
      log.error(errorInfo);
  }
};

module.exports = {
  log,
};
