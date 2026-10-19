# design-software-web-bff (Node/TS)

Backend-for-Frontend del **shell web** (agregación cross-dominio). ADR-005/006.
Hexagonal · contract-first (SDD, `shared-contracts`) · TDD. El BFF llama a los
servicios vía el **edge** (nunca a una BD).

## Estructura
```
src/domain                reglas de agregación (delgado)
src/application           usecase + port/inbound + port/outbound
src/adapter               inbound/http · outbound/client (a los servicios)
src/apps/server.ts        contenedor
```
## Correr
```
npm install && npm run build && npm test
npm start   # :8080  (GET /health, GET /dashboard)
```
