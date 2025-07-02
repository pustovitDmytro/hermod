FROM pustovitdmytro/hermod-base:1.1.2

WORKDIR /app

CMD ["node", "lib/bin/worker.js", "start"]