/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-case-declarations */
/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable no-param-reassign */

export function expandObject(obj) {
    const fixed = {};
    const variable = [];

    for (const [ key, value ] of Object.entries(obj)) {
        if (Array.isArray(value)) {
            variable.push({ key, values: value });
        } else {
            fixed[key] = value;
        }
    }

    function cartesianProduct(vars, index = 0, current = {}, result = []) {
        if (index === vars.length) {
            result.push({ ...fixed, ...current });

            return;
        }

        const { key, values } = vars[index];

        for (const val of values) {
            current[key] = val;
            cartesianProduct(vars, index + 1, current, result);
        }

        return result;
    }

    return cartesianProduct(variable);
}

function getParamMap(params) {
    const map = {};

    for (const p of params) {
        map[p.key] = p;
    }

    return map;
}

function getDeepValue(obj, path) {
    return path.split('.').reduce((o, key) => o?.[key], obj);
}

const operators = {
    round    : (args) => Math.round(args[0]),
    floor    : (args) => Math.floor(args[0]),
    ceil     : (args) => Math.ceil(args[0]),
    divide   : (args) => (args[1] !== 0) ? args[0] / args[1] : null,
    multiply : (args) => args.reduce((a, b) => a * b, 1),
    add      : (args) => args.reduce((a, b) => a + b, 0),
    subtract : (args) => args.length === 1 ? -args[0] : args[0] - args[1],
    concat   : (args) => args.join('')
};

function evaluateNode(node, context, dumped) {
    switch (node.type) {
        case 'number':
            return +getDeepValue(context, node.key);
        case 'string':
            return getDeepValue(context, node.key);

        case 'dumped_value':
            return dumped[node.key];

        case 'function':
            const fn = operators[node.operator];

            if (!fn) throw new Error(`Unknown operator: ${node.operator}`);
            const args = Array.isArray(node.arguments)
                ? node.arguments.map(arg => evaluateNode(arg, context, dumped))
                : [ evaluateNode(node.arguments, context, dumped) ];

            return fn(args);

        default:
            throw new Error(`Unknown node type: ${node.type}`);
    }
}

function extractDependencies(node) {
    const deps = new Set();

    function walk(n) {
        if (n.type === 'dumped_value') {
            deps.add(n.key);
        } else if (n.type === 'function' && Array.isArray(n.arguments)) {
            n.arguments.forEach((element) => {
                walk(element);
            });
        }
    }

    walk(node);

    return [ ...deps ];
}

function topologicalSortConfig(config) {
    const graph = {};
    const inDegree = {};

    for (const [ key, node ] of Object.entries(config)) {
        const deps = extractDependencies(node);

        graph[key] = deps;
        inDegree[key] = inDegree[key] || 0;

        for (const dep of deps) {
            inDegree[dep] = inDegree[dep] || 0;
            inDegree[key]++;
        }
    }

    const sorted = [];
    const queue = Object.entries(inDegree)
        .filter(([ , deg ]) => deg === 0)
        .map(([ key ]) => key);

    while (queue.length > 0) {
        const current = queue.shift();

        sorted.push(current);

        for (const [ node, deps ] of Object.entries(graph)) {
            if (deps.includes(current)) {
                inDegree[node]--;
                if (inDegree[node] === 0) queue.push(node);
            }
        }
    }

    if (sorted.length !== Object.keys(config).length) {
        throw new Error('Cyclic dependency detected in config');
    }

    return sorted.map((key) => [ key, config[key] ]);
}


export function dump(item, config) {
    const paramMap = getParamMap(item.params || []);
    const context = {
        ...item,
        params : new Proxy({}, {
            get(_, key) {
                return paramMap[key] || { value: {} };
            }
        })
    };

    const result = {
        _fulltext : ''
    };

    for (const [ key, expr ] of topologicalSortConfig(config)) {
        result[key] = evaluateNode(expr, context, result);
        if (result[key]) {
            result._fulltext = `${result._fulltext} ${result[key]}`;
        }
    }

    result._fulltext = result._fulltext.toLowerCase();

    return result;
}
