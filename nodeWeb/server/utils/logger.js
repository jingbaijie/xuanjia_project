/*
 * @Description: 
 * @Author: jwzx
 * @Date: 2020-07-16 20:33:38
 * @LastEditTime: 2020-11-03 19:20:16
 * @LastEditors: jwzx
 */


const winston = require("winston");
require("winston-daily-rotate-file");
const { combine, timestamp, printf } = winston.format;
const path = require("path");

var myFormat = printf(({ level, message, timestamp }) => {
    if (process.env.NODE_ENV !== "production") {
        console.log(`${timestamp} ${level} ${message} `)
    }
    return `${timestamp} ${level} ${message} `;
})

var transport = new (winston.transports.DailyRotateFile)({
    filename: path.join(__dirname, "../../log/application-%DATE%.log"),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
});

const logger = winston.createLogger({
    level: "info",
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        myFormat
    ),
    transports: [
        transport
    ]
});

module.exports = logger;

