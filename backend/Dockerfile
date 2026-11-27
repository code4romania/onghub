# Node >= 22.12 is required: oidc-provider 9 / jose 6 are ESM-only and are
# loaded from this CommonJS app via require(esm). Keep in sync with
# package.json "engines" and .nvmrc.
FROM --platform=linux/amd64 node:22.17.0-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM --platform=linux/amd64 node:22.17.0-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG VERSION
ARG REVISION
ENV VERSION=${VERSION}
ENV REVISION=${REVISION}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]
