FROM pustovitdmytro/hermod-base:0.0.3

WORKDIR /app

CMD ["node", "lib/bin/worker.js", "start"]