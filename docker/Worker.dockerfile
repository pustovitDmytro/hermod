FROM pustovitdmytro/hermod-base:1.2.1

WORKDIR /app

CMD ["node", "lib/bin/worker.js", "start"]