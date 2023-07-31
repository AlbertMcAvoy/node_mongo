import {createLogger, transports, format, addColors, Logger} from "winston";
const logsFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} - [${level.toLocaleUpperCase()}]: ${message}`;
});

const config = {
    levels: {
        errors: 0,
        warns: 1,
        access: 2,
        silly: 6
    },
    colors: {
        errors: 'red',
        warns: 'yellow',
        access: 'blue',
        silly: 'grey'
    }
};

addColors(config.colors);
export const wLogger = (input: { level: string }): Logger =>
    createLogger({
        levels: config.levels,
        level: `${input.level}`,
        transports: [
            new transports.Console({
                level: `${input.level}`,
                format: format.combine(format.timestamp(), logsFormat,
                    format.colorize({ all: true })
                )
            }),
            new transports.File({
                filename: `logs/${input.level}.log`,
                level: `${input.level}`,
                format: format.combine(format.timestamp(), logsFormat)
            }),
            new transports.File({
                filename: 'logs/globalLogs.log',
                level: 'silly',
                format: format.combine(format.timestamp(), logsFormat)
            })
        ]
    });