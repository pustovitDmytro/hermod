// import Surreal from 'surrealdb.js';

import { Surreal, RecordId } from 'surrealdb';
import config from './etc/config';

class SurrealDB {
    constructor(c) {
        this.surreal = new Surreal();

        this.connected = false;
        this.config = c;
    }

    async connect() {
        if (!this.connected) {
            await this.surreal.connect(this.config.url, {
                namespace : this.config.namespace,
                database  : this.config.database,
                auth      : {
                    username : this.config.username,
                    password : this.config.password
                }
            });

            this.connected = true;
        }
    }

    async close() {
        this.surreal.close();
        this.connected = false;
    }

    async select(thing) {
        await this.connect();

        return this.surreal.select(thing);
    }

    async query(sql, vars = {}) {
        await this.connect();

        return this.surreal.query(sql, vars);
    }

    async create(table, data) {
        await this.connect();

        return this.surreal.create(table, data);
    }

    async merge(table, id, data) {
        await this.connect();

        return this.surreal.merge(new RecordId(table, id), data);
    }

    async delete(table, id) {
        await this.connect();

        return this.surreal.delete(new RecordId(table, id));
    }
}

export default new SurrealDB(config.surreal);

