import Configuration from '../tables/Configuration';
import ProgressNotifier from '../ProgressNotifier';
import queue, { RUN_PARSE_REQUEST } from '../queues/realEstateRequest';

export default async function () {
    const pn = new ProgressNotifier();

    const configurations = await Configuration.findAll({ type: 'real_estate' });

    pn.progress(0.3, `Data Loaded: ${configurations.length} items found`);

    const jobs = [];

    for (const conf of configurations) {
        const job = await queue.createJob(RUN_PARSE_REQUEST, conf);

        jobs.push(job.id);
    }

    pn.progress(1, `${jobs.length} ${RUN_PARSE_REQUEST} jobs created`);

    return jobs;
}

