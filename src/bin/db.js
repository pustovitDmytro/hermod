#!./node_modules/.bin/babel-node
import { docopt } from 'docopt';
import configurations from '../../fixtures/configurations';
import watched from '../../fixtures/watched';
import db from '../db';
import Configuration from '../tables/Configuration';
import Watched from '../tables/Watched';
import { docoptRunner } from './utils';

const doc = `Usage:
    db.js push <table>
    db.js -h | --help

    Options:
        sync fixtures
        <table> table to sync
        -h  --help Test workers
`;

async function syncDB(table) {
    if (table.includes('config')) await Configuration.sync(configurations);
    if (table.includes('watch')) await Watched.sync(watched);
}


async function run(opts) {
    await db.connect();
    console.log('connected');

    if (opts.push) {
        await syncDB(opts['<table>']);
    }

    await db.close();
    console.log('closed');
}

docoptRunner(docopt(doc), run, { noExit: true });

