import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

let counter = 0;

/**
 * supertest wrapper where every request comes from its own address
 * (X-Forwarded-For, honoured because of `trust proxy`), so the per-IP
 * throttle does not trip suites that are not about throttling.
 */
export function api(app: INestApplication) {
  const server = app.getHttpServer();
  const from = (test: request.Test): request.Test =>
    test.set(
      'X-Forwarded-For',
      `10.0.${Math.floor(++counter / 250) % 250}.${counter % 250}`,
    );

  return {
    get: (url: string) => from(request(server).get(url)),
    post: (url: string) => from(request(server).post(url)),
    patch: (url: string) => from(request(server).patch(url)),
    delete: (url: string) => from(request(server).delete(url)),
  };
}
