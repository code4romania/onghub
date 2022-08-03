import { ExpressAdapter } from '@bull-board/express';
import { Logger, INestApplication } from '@nestjs/common';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { createBullBoard } from '@bull-board/api';
import { QUEUES } from 'src/common/constants/queues.constants';
import { Queue } from 'bull';
import { COMMON_ERRORS } from 'src/common/constants/error-common.constants';

export function createQueueMonitoring(app: INestApplication) {
  try {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
      queues: [
        ...Object.keys(QUEUES).map((QUEUE) => {
          const instance = app.get<Queue>(`BullQueue_${QUEUES[QUEUE]}`);
          return new BullAdapter(instance);
        }),
      ],
      serverAdapter: serverAdapter,
    });

    return serverAdapter;
  } catch (err) {
    app
      .get(Logger)
      .log(COMMON_ERRORS.BULLBOARD.message, COMMON_ERRORS.BULLBOARD.errorCode);
  }
}
