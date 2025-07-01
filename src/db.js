// import Surreal from 'surrealdb.js';

import { Surreal } from 'surrealdb';
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

    async merge(thing, data) {
        await this.connect();

        return this.surreal.merge(thing, data);
    }

    async delete(thing) {
        await this.connect();

        return this.surreal.delete(thing);
    }
}

export default new SurrealDB(config.surreal);

