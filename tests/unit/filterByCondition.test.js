import { assert } from 'chai';
import { load } from '../utils';
import configs from '../../fixtures/configurations.json';
import olxRaw from '../fixtures/olx_raw.json';

const { filterByCondition } = load('workers/realEstateRequest.js');
const { dump } = load('parsers/utils.js');

suite('Unit: filterByCondition');

before(async function () {});

test('$price_per_meter <> X', async function () {
    const raw = olxRaw[0];
    const dumped = dump(raw, configs[0].attributes);

    assert.isTrue(filterByCondition('$price_per_meter < 1850')(dumped));
    assert.isFalse(filterByCondition('$price_per_meter > 1850')(dumped));
});

test('$total_floors and $floor math', async function () {
    const raw = olxRaw[0];
    const dumped = dump(raw, configs[0].attributes);

    assert.isTrue(filterByCondition('$total_floors - $floor > 1')(dumped));
    assert.isFalse(filterByCondition('$total_floors - $floor > 11')(dumped));
});


after(async function () {});
