FROM node:24-alpine AS build
WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY src ./src
RUN npm run build

FROM node:24-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json ./
USER node
EXPOSE 8080
ENTRYPOINT ["node", "dist/apps/server.js"]
