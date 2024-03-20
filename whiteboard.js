import pino from 'pino';
import moment from 'moment';

// Assuming `global.reqInfo` type is defined somewhere globally. If not, define a type for it.
// For demonstration, let's assume it looks something like this:
interface ReqInfo {
  method: string;
  path: string;
  body: any; // Replace `any` with a more specific type if possible
  query: any; // Replace `any` with a more specific type if possible
  user?: {
    id: string;
    name: string;
  };
  ip: string;
}

declare global {
  namespace NodeJS {
    interface Global {
      reqInfo?: ReqInfo;
    }
  }
}

const log = pino({});

interface CustomErrorFunction {
  (
    error: Error | string,
    details?: string,
    LogLevel?: string
  ): void;
}

const customError: CustomErrorFunction = (error, details = '', LogLevel = process.env.LOG_LEVEL) => {
  const req = global.reqInfo;
  const e = error instanceof Error ? error : new Error(error);
  const frame = e.stack?.split('\n')[2] ?? '';
  const functionName = frame.split(' ')[5];
  const lineNumber = frame.split(':').reverse()[1];
  
  const errorInfo = {
    reqInfo: req
      ? {
          req: {
            method: req.method,
            path: req.path,
            body: req.body,
            query: req.query,
          },
          user: req.user
            ? {
                id: req.user.id,
                name: req.user.name,
              }
            : null,
          server: {
            ip: req.ip,
            servertime: moment().format('YYYY-MM-DD HH:mm:ss'),
          },
        }
      : null,
    functionName,
    lineNumber,
    errorType: 'application error',
    stack: e.stack,
    message: e.message,
    env: process.env.NODE_ENV,
    logLevel: LogLevel,
    process: details,
  };
  
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
    default:
      log.error(errorInfo);
  }
};

// Extending the logger instance with a custom function
interface CustomLogger extends pino.Logger {
  customError: CustomErrorFunction;
}

const extendedLog = log as CustomLogger;
extendedLog.customError = customError;

export { extendedLog as log };
