FROM pustovitdmytro/hermod-base:1.1.3

WORKDIR /app

ENV PORT=8010
EXPOSE 8010

CMD ["node", "lib/web.js"]