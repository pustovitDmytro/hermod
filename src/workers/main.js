import logger from '../logger';
import realEstateMain, { RUN_MAIN_REAL_ESTATE } from '../queues/realEstateMain';
import cleanupQueue, { RUN_CLEANUP } from '../queues/cleanupQueue';

const LIST = [
    { queue: realEstateMain, type: RUN_MAIN_REAL_ESTATE },
    { queue: cleanupQueue, type: RUN_CLEANUP }
];

export default async function () {
    logger.info('STARTING MAIN WORKER');

    const result = {};

    await Promise.all(LIST.map(async start => {
        const job = await start.queue.createJob(start.type);

        logger.info({ type: start.type, job: job.id });
        result[start.type] = job.id;
    }));

    return result;
}
