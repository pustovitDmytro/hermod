import config from '../etc/config';
import handler from '../workers/sendNotify';
import Queue from './Queue';

export const RUN_NOTIFY = 'RUN_NOTIFY';

export default new Queue({
    ...config.queue.sendNotify,
    redis : config.redis
}, {
    [RUN_NOTIFY] : handler
});
