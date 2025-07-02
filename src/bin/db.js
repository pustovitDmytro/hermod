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
    db.js get <table>
    db.js -h | --help

    Options:
        push    push fixtures to db
        get     show db data
        <table> table to sync
        -h  --help Test workers
`;

function getModel(table) {
    if (table.includes('config')) return Configuration;
    if (table.includes('watch')) return Watched;
}

function getFixtures(table) {
    if (table.includes('config')) return configurations;
    if (table.includes('watch')) return watched;
}

async function syncDB(table) {
    const model = getModel(table);

    await model.sync(getFixtures(table));
}


async function getDB(table) {
    const model = getModel(table);
    const data = await model.findAll();

    console.log(data);
}

async function run(opts) {
    await db.connect();
    console.log('connected');

    if (opts.push) {
        await syncDB(opts['<table>']);
    }

    if (opts.get) {
        await getDB(opts['<table>']);
    }

    await db.close();
    console.log('closed');
}

docoptRunner(docopt(doc), run, { noExit: true });

