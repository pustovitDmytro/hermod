FROM pustovitdmytro/hermod-base:1.1.3

WORKDIR /app

CMD ["node", "lib/bin/worker.js", "start"]