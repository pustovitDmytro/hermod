/* eslint-disable no-return-await */
import db from '../db';
import logger from '../logger';

export default class SurrealDBTable {
    constructor(tableName) {
        this.table = tableName;
        this.db = db;
    }

    getThing(id) {
        return `${this.table}:${id}`;
    }

    async findOne(id) {
        const [ res ] = await this.db.select(this.getThing(id));

        return res;
    }

    async findAll(query = {}) {
        let sql = `SELECT * FROM ${this.table}`;

        const vars = {};

        if (Object.keys(query).length > 0) {
            const conditions = Object.entries(query).map(([ key, value ], idx) => {
                const varName = `v${idx}`;

                vars[varName] = value;

                return `${key} = $${varName}`;
            });

            sql += ` WHERE ${conditions.join(' AND ')}`;
        }

        const [ res ] = await this.db.query(sql, vars);

        return res.map(item => ({
            ...item,
            id : typeof item.id === 'object' && item.id.tb && item.id.id
                ? item.id.id
                : item.id
        }));
    }

    async create(data) {
        const res = await this.db.create(this.table, data);

        return res[0];
    }

    async update(id, data) {
        const res = await this.db.merge(this.getThing(id), data);

        return res[0];
    }

    async delete(id) {
        return await this.db.delete(this.getThing(id));
    }

    async sync(items) {
        const existingItems = await this.findAll();
        const existingIds = new Set(existingItems.map(item => item.id));

        const newIds = new Set(items.map(item => item.id));

        for (const item of items) {
            if (existingIds.has(item.id)) {
                await this.update(item.id, item);
                logger.info(`updated ${this.table}: ${item.id}`);
            } else {
                try {
                    await this.create(item);
                    logger.info(`created ${this.table}: ${item.id}`);
                } catch (error) {
                    if (error.message.includes('already exists')) {
                        await this.update(item.id, item);
                        logger.info(`updated already existed ${this.table}: ${item.id}`);
                    } else {
                        throw error;
                    }
                }
            }
        }

        for (const item of existingItems) {
            if (!newIds.has(item.id)) {
                await this.delete(item.id);
                logger.info(`deleted ${this.table}: ${item.id}`);
            }
        }

        logger.info(`synced ${this.table}: ${items.length}`);
    }
}
