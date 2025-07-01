import { assert } from 'chai';
import Test from '../Test';
import { load } from '../utils';

const factory = new Test();
const handler = load('workers/cleanup').default;

suite('Workers: cleanup #redis');

before(async function () {
    await factory.dropQueue();
});

test('run cleanup handler', async function () {
    const res = await handler();

    assert.deepInclude(res, {
        'send-notify'         : null,
        'real-estate-request' : 0,
        'real-estate-main'    : 0,
        'cleanup-jobs'        : 0
    });
});

after(async function () {
    await factory.dropQueue();
});
