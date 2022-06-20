## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Prerequisites to run db locally

https://www.docker.com/products/docker-desktop

# General

Postman collection in `./docs/`

Link to swagger docs and running app are displayed in terminal on starting the app.

See more info for configuring swagger docs here: https://docs.nestjs.com/openapi/types-and-parameters

Set `TYPEORM_DEBUG` env variable to `1` to see raw queries and errors.

# Installation

```bash
$ npm install
```

# Running the app

```bash
$ touch .env
```

Set env variables, based on `.env.example`

```bash
# to start db locally
$ docker-compose up -d

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
