import config from '../etc/config';
import handler from '../workers/realEstateRequest';
import Queue from './Queue';

export const RUN_PARSE_REQUEST = 'RUN_PARSE_REQUEST';

export default new Queue({
    ...config.queue.realEstateRequest,
    redis : config.redis
}, {
    [RUN_PARSE_REQUEST] : handler
});
