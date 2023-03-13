const appRoot = require("app-root-path");
const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const { isDevelopment } = require("../utils/server");

const logger = createLogger({
  level: "silly",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.DailyRotateFile({
      filename: appRoot + "/logs/errors.log",
      level: "error",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
    }),
    new transports.DailyRotateFile({
      filename: appRoot + "/logs/combined.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
    }),
  ],
});

logger.stream = {
  write: function (message) {
    logger.info(message);
  },
};

if (isDevelopment()) {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    })
  );
}

export default logger;
