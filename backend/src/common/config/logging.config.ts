export const PinoLoggerConfig = {
  pinoHttp: {
    level: 'trace',
    autoLogging: {
      ignore: (req) => {
        return req.url.includes('health');
      },
    },
  },
};
