#!/usr/bin/env node

/**
 * Module dependencies.
 */
var ENV = process.env.NODE_ENV || 'production';
var program = require('commander');
var cluster = require('cluster');
var CUPS = require('os').cpus().length;
var TYPE = process.env.CLIENT_TYPE ? process.env.CLIENT_TYPE : 'saas';
var logger = require('../components/logger')();

program
    .version(require('../package.json').version)
    .option('-p, --port <n>', 'Deploy port.')
    .option('-c, --cluster', 'The worker processes are spawned when this argument passed by.')
    .option('-t, --target [url]', 'Proxy pass target.')
    .parse(process.argv);

if (!program.port) {
    throw new Error("You must use -p to set the port argument. e.g. -p 8080.");
}

if (program.cluster && cluster.isMaster) {
    for (var i = 0; i < CUPS; i++) {
        cluster.fork();
    }
    cluster.on('exit', function (worker, code, signal) {
        logger.warn('worker#%s died.', worker.process.pid);
        cluster.fork();
    });
} else {
    require('../proxy')(program.target).listen(program.port, config.ip, function (err) {
        logger.info('listening on %d,  using %s client, in %s mode, proxy pass %s', program.port, TYPE, ENV, program.target);
    }).on('error', function (err) {
        if (err) {
            throw err;
        }
    });
}
