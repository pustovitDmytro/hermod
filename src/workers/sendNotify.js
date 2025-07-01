import Telegram from '../notifiers/telegram';
import Cache from '../Cache';
import appConfig from '../etc/config';

const NOTIFIERS = {
    telegram : Telegram
};

const cache = new Cache({
    prefix : appConfig.cache.notify.prefix,
    ttl    : appConfig.cache.notify.ttl
});

export default async function (job) {
    const { config, payload } = job.data;

    if (await cache.has(payload.id)) {
        await cache.saveOne(payload.id);

        return;
    }

    const Notifier = NOTIFIERS[config.type];

    const notify = new Notifier(config);

    await notify.send(payload);

    await cache.saveOne(payload.id);
}
