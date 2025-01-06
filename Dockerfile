FROM node:22-alpine AS base

FROM base AS client_build

ARG VITE_TAX_RATE
ARG VITE_API_URL

ENV VITE_TAX_RATE=$VITE_TAX_RATE
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app
COPY ./client/ /app/
RUN npm ci && npm run build

FROM base AS server_build
# copy all to /app/ except client
WORKDIR /app

COPY package*.json /app/
RUN npm ci --omit=dev

COPY *.js /app/
COPY ./controllers/ /app/controllers/
COPY ./models/ /app/models/
COPY ./utils/ /app/utils/

# copy client build to /app/dist
COPY --from=client_build /app/dist /app/dist

CMD ["node", "server.js"]


