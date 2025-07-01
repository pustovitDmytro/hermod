import Api from '../api/OlxApi';
import { expandObject, dump } from './utils.js';

export default class OLXParser {
    constructor(config) {
        this.config = config;
        this.api = new Api();
    }

    async load() {
        const filters = expandObject(this.config.filters);

        const allItems = [];

        for (const filter of filters) {
            const items = await this.api.fetchItems(filter);

            allItems.push(...items);
        }

        return allItems.map(i => dump(i, this.config.attributes));
    }
}
