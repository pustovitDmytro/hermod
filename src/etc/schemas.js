const e = process.env;

export const queueSchema = prefix => ({
    name        : { $source: `{${prefix}_NAME}`, $validate: [ 'required', 'string' ] },
    ttl         : { $source: `{${prefix}_TTL}`, $validate: [ 'required', 'time_unit' ] },
    attempts    : { $source: `{${prefix}_ATTEMPTS}`, $validate: [ 'required', 'integer', { 'min': 1 } ] },
    concurrency : { $source: `{${prefix}_CONCURRENCY}`, $validate: [ 'required', 'integer', { 'min': 1 } ] },
    logLevel    : {
        $source   : `{${prefix}_LOG_LEVEL}`,
        $validate : [ 'required', { 'enum': [ 'error', 'warn', 'info', 'notice', 'verbose', 'debug' ] } ]
    },
    repeat     : !!e[`${prefix}_REPEAT`] ? { $source: `{${prefix}_REPEAT}`, $validate: [ 'cron' ] } : null,
    canProcess : { $source: `{${prefix}_PROCESS}`, $validate: [ 'required', 'boolean' ] },
    backoff    : !!e[`${prefix}_BACKOFF_TYPE`] ? {
        type  : { $source: `{${prefix}_BACKOFF_TYPE}`, $validate: [ { 'enum': [ 'exponential' ] } ] },
        delay : { $source: `{${prefix}_BACKOFF_DELAY}`, $validate: [ 'string' ] }
    } : null,
    autoremove : { $source: `{${prefix}_KEEP_LAST}`, $validate: [ 'integer', { min: 0 } ] },
    rateLimit  : !!e[`${prefix}_RATE_LIMIT_MAX`] ? {
        max      : { $source: `{${prefix}_RATE_LIMIT_MAX}`, $validate: [ 'required', 'integer', { 'min': 1 } ] },
        duration : { $source: `{${prefix}_RATE_LIMIT_DURATION}`, $validate: [ 'required', 'time_unit' ] }
    } : null
});

export const cacheSchema = prefix => ({
    prefix : { $source: `{${prefix}_PREFIX}`, $validate: [ 'required', 'string' ] },
    ttl    : { $source: `{${prefix}_TTL}`, $validate: [ 'required', 'time_unit' ] }
});
