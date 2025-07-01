import { v4 as uuid } from 'uuid';
import OlxParser from '../parsers/olx';
import Watched from '../tables/Watched';
import logger from '../logger';
import queue, { RUN_NOTIFY } from '../queues/sendNotify';

const PARSERS = {
    olx : OlxParser
};

function filterByIgnoreList(ignoreNormalized) {
    return item => {
        const title = (item.title || '').toLowerCase();
        const description = (item.description || '').toLowerCase();

        return !ignoreNormalized.some(term =>
            title.includes(term) || description.includes(term));
    };
}

function filterByWatched(watchedIds) {
    return item => {
        return !watchedIds.includes(item.id);
    };
}

export default async function (job) {
    const config = job.data;

    const Parser = PARSERS[config.parser];
    const parser = new Parser(config);

    const [ list, [ watched ] ] = await Promise.all([
        parser.load(),
        Watched.findAll({ configuration: config.id })
    ]);

    const alreadyWatchedList = watched ? watched.items : [];

    let filteredList = list;

    if (config.ignore) {
        const { match } = config.ignore;

        if (match) {
            const ignoreNormalized = match.map(str => str.toLowerCase());

            filteredList = filteredList.filter(filterByIgnoreList(ignoreNormalized));
        }
    }

    if (alreadyWatchedList.length > 0) {
        filteredList = filteredList.filter(filterByWatched(alreadyWatchedList));
    }

    logger.info(`Ads left after filtering for ${config.id}: ${filteredList.length}`);

    if (config.notify) {
        await Promise.all(
            filteredList.map(l => queue.createJob(RUN_NOTIFY, { config: config.notify, payload: l }))
        );
    }

    const newWatchedList = new Set([ ...list.map(l => l.id), ...alreadyWatchedList ]);

    await (watched
        ? Watched.update(watched.id, { ...watched, items: [ ...newWatchedList ] })
        : Watched.create({
            id            : uuid(),
            configuration : config.id,
            items         : [ ...newWatchedList ]
        }));

    return filteredList.map(l => l.id);
}
