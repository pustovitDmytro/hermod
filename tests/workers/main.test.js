import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';

const factory = new Test();
const handler = load('workers/main').default;

suite('Workers: main #redis');

before(async function () {
    await factory.dropQueue();
});

test('run main handler', async function () {
    const res = await handler();

    assert.include(res.RUN_MAIN_REAL_ESTATE, 'repeat:');
    assert.include(res.RUN_CLEANUP, 'repeat:');
});

after(async function () {
    await factory.dropQueue();
});
