FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm ci --omit=dev

COPY index.js ./
COPY genreCatalog.js ./

EXPOSE 5000

CMD ["node", "index.js"]
