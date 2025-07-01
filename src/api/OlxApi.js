import { exec } from 'child_process';
import querystring from 'querystring';
import BaseAPI from 'base-api-client';

const LIMIT = 30;

export default class OLXAPI extends BaseAPI {
    _axios({ url, method = 'GET', headers = {}, params = {} }) {
        return new Promise((resolve, reject) => {
            const query = querystring.stringify(params);
            const fullUrl = query ? `${url}?${query}` : url;

            // Convert headers to curl format
            const headerArgs = Object.entries(headers).map(
                ([ key, val ]) => `-H "${key}: ${val}"`
            ).join(' ');

            const curlCommand = `curl -s -X ${method.toUpperCase()} ${headerArgs} "${fullUrl}" --compressed`;

            // eslint-disable-next-line security/detect-child-process, promise/prefer-await-to-callbacks
            exec(curlCommand, (error, stdout, stderr) => {
                if (error) {
                    return reject(new Error(`curl failed: ${stderr || error.message}`));
                }

                try {
                    const json = JSON.parse(stdout);

                    resolve(json);
                } catch (error_) {
                    console.error(error_);
                    reject(new Error(`Failed to parse JSON: ${error_.message}`));
                }
            });
        });
    }

    async fetchItems(query, offset = 0, allItems = []) {
        const params = {
            offset,
            limit : LIMIT,
            ...query
        };

        const items = await this.get('https://www.olx.ua/api/v1/offers/', params);

        allItems.push(...items);
        if (items.length === LIMIT) {
            return this.fetchItems(query, offset + LIMIT, allItems);
        }

        return allItems;
    }
}
