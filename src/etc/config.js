import dotenv from 'dotenv';
import { Assembler } from 'cottus';
import cottus from '../utils/cottus';
import { queueSchema, cacheSchema } from './schemas';

dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.defaults' });

const e = process.env;

const schema = {
    queue : {
        realEstate        : queueSchema('REAL_ESTATE_QUEUE'),
        realEstateRequest : queueSchema('REAL_ESTATE_REQUEST_QUEUE'),
        sendNotify        : queueSchema('SEND_NOTIFY_QUEUE'),
        cleanup           : queueSchema('CLEANUP_QUEUE')
    },
    cache : {
        notify : cacheSchema('NOTIFY_CACHE')
    },
    redis : {
        port           : { $source: '{REDIS_PORT}', $validate: [ 'required', 'port' ] },
        host           : { $source: '{REDIS_HOST}', $validate: [ 'required', 'hostname' ] },
        db             : { $source: '{REDIS_DB}', $validate: [ 'integer' ] },
        password       : { $source: '{REDIS_PASSWORD}', $validate: [ 'string' ] },
        username       : { $source: '{REDIS_USER}', $validate: [ 'string' ] },
        connectTimeout : { $source: '{REDIS_CONNECT_TIMEOUT}', $validate: [ 'integer' ] },
        tls            : { $source: '{REDIS_TLS}', $validate: [ 'boolean' ] }
    },
    surreal : {
        url       : { $source: '{SURREAL_URL}', $validate: [ 'required', 'string' ] },
        namespace : { $source: '{SURREAL_NAMESPACE}', $validate: [ 'required', 'string' ] },
        database  : { $source: '{SURREAL_DATABASE}', $validate: [ 'required', 'string' ] },
        password  : { $source: '{SURREAL_PASSWORD}', $validate: [ 'string' ] },
        username  : { $source: '{SURREAL_USERNAME}', $validate: [ 'string' ] }
    },
    web : {
        port   : { $source: '{PORT}', $validate: [ 'required', 'port' ] },
        start  : { $source: '{WEB_START}', $validate: [ 'required', 'boolean' ] },
        prefix : { $source: '{WEB_PREFIX}', $validate: [ 'required', 'path' ] },
        admin  : {
            password : { $source: '{BASIC_ADMIN_PASSWORD}', $validate: [ 'required', 'string' ] },
            user     : { $source: '{BASIC_ADMIN_USER}', $validate: [ 'required', 'string' ] }
        }
    },
    telegram : {
        botId    : { $source: '{TELEGRAM_BOT_ID}', $validate: [ 'required', 'integer' ] },
        botToken : { $source: '{TELEGRAM_BOT_TOKEN}', $validate: [ 'required', 'string', { min: 35 }, { max: 35 } ] }
    },
    shutdown : {
        forceTimeout : { $source: '{FORCE_TIMEOUT_EXIT}', $validate: [ 'required', 'time_unit' ] }
    }
};

const assembler = new Assembler(cottus, schema);

assembler.parse();
const config = assembler.run(e);

export default config;
