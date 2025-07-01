import config from '../etc/config';
import handler from '../workers/realEstateMain';
import Queue from './Queue';

export const RUN_MAIN_REAL_ESTATE = 'RUN_MAIN_REAL_ESTATE';

export default new Queue({
    ...config.queue.realEstate,
    redis : config.redis
}, {
    [RUN_MAIN_REAL_ESTATE] : handler
});
