FROM --platform=linux/amd64 node:16.15.1-alpine As development

WORKDIR /usr/src/app

COPY package*.json ./

# Install rimraf to allow 'nestjs build' remove the dist 
RUN npm install rimraf 
RUN npm install --only=development

COPY . .

RUN npm run build

FROM --platform=linux/amd64 node:16.15.1-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG VERSION
ARG REVISION
ENV VERSION=${VERSION}
ENV REVISION=${REVISION}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]