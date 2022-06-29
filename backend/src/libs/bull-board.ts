import { ExpressAdapter } from '@bull-board/express';
import { INestApplication } from '@nestjs/common';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { createBullBoard } from '@bull-board/api';
import { QUEUES } from 'src/common/constants/queues.constants';
import { Queue } from 'bull';
import { Logger } from 'nestjs-pino';
import {
  CommonErrorCodes,
  CommonErrorMessages,
} from 'src/common/constants/error-common.constants';

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
      .log(CommonErrorMessages.BULLBOARD_001, CommonErrorCodes.E_BULLBOARD_001);
  }
}
