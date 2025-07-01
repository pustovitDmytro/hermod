#!./node_modules/.bin/babel-node
import { docopt } from 'docopt';
import realEstateRequest from '../workers/realEstateRequest';
import configs from '../../fixtures/configurations.json';
import { docoptRunner } from './utils';

const doc = `Usage:
    test.js realEstateRequest
    test.js -h | --help

    Options:
        -h  --help    Test workers
`;

async function testRealEstateRequest() {
    await realEstateRequest({
        data : {
            ...configs[0],
            notify : null
        }
    });
}

async function run(opts) {
    if (opts.realEstateRequest) {
        await testRealEstateRequest();
    }
}

docoptRunner(docopt(doc), run, { noExit: true });

