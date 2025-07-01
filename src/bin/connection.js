#!./node_modules/.bin/babel-node
import { docopt } from 'docopt';
import { v4 as uuid } from 'uuid';
import getClient from '../redis';
import db from '../db';

import { docoptRunner } from './utils';

const doc = `Usage:
    test.js redis
    test.js surreal
    test.js -h | --help

    Options:
        -h  --help    Test connection
`;

async function testRedis() {
    const client = getClient({
        connectTimeout : 10_000
    });

    console.log('connecting...');
    const key = 'test_redis_auth';
    const res = await client.set(key, (new Date()).toISOString());

    console.log(`set ${key}:`, res);

    const res2 = await client.get(key);

    console.log(`get ${key}:`, res2);
}


async function testDB() {
    console.log('connecting...');
    await db.connect();
    console.log('connected');

    const id = uuid();

    await db.create('test_connection', { id });

    console.log('created');

    await db.delete(`test_connection:${id}`);

    console.log('removed');

    await db.close();
    console.log('closed');
}

async function run(opts) {
    if (opts.redis) {
        await testRedis();
    }

    if (opts.surreal) {
        await testDB();
    }
}

docoptRunner(docopt(doc), run);

