# syntax=docker/dockerfile:1

FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/contracts/package.json ./packages/contracts/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

RUN npm ci

FROM deps AS api-build
WORKDIR /app

COPY tsconfig.base.json tsconfig.json ./
COPY packages/contracts ./packages/contracts
COPY apps/api ./apps/api

RUN rm -rf packages/contracts/dist apps/api/dist \
  && npm run build --workspace=@dof-update/contracts \
  && npm run build --workspace=@dof-update/api \
  && mkdir -p apps/api/dist/db/migrations \
  && cp apps/api/src/db/migrations/*.sql apps/api/dist/db/migrations/

FROM node:22-alpine AS api
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

COPY package.json package-lock.json ./
COPY packages/contracts/package.json ./packages/contracts/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/

RUN npm ci --omit=dev

COPY --from=api-build /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=api-build /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api
EXPOSE 3001
CMD ["node", "dist/server.js"]

FROM deps AS web-build
WORKDIR /app

ARG VITE_GA4_MEASUREMENT_ID=
ARG VITE_META_PIXEL_ID=
ARG VITE_SITE_URL=https://dofupdate.com.br
ENV VITE_GA4_MEASUREMENT_ID=$VITE_GA4_MEASUREMENT_ID
ENV VITE_META_PIXEL_ID=$VITE_META_PIXEL_ID
ENV VITE_SITE_URL=$VITE_SITE_URL

COPY tsconfig.base.json tsconfig.json ./
COPY packages/contracts ./packages/contracts
COPY apps/web ./apps/web

RUN rm -rf packages/contracts/dist \
  && npm run build --workspace=@dof-update/contracts \
  && npm run build --workspace=@dof-update/web

FROM nginx:1.27-alpine AS web
COPY infra/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=web-build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80

FROM api AS fullstack
ENV WEB_ROOT=/app/apps/api/dist/web
COPY --from=web-build /app/apps/web/dist /app/apps/api/dist/web
EXPOSE 3001
