import { assert } from 'chai';
import { load } from '../utils';
import configs from '../../fixtures/configurations.json';
import olxRaw from '../fixtures/olx_raw.json';

const { dump } = load('parsers/utils.js');

suite('Unit: parsers');

before(async function () {});

test('dump olx data for flat config', async function () {
    for (const raw of olxRaw) {
        const dumped = dump(raw, configs[0].attributes);

        console.log('dumped.price_per_meter:', dumped.price_per_meter, dumped);
        assert.exists(dumped.price_per_meter, JSON.stringify(raw));
        break;
    }
});

after(async function () {});
