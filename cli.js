#!/usr/bin/env node
'use strict';
var yeoman = require('yeoman-environment');
var env = yeoman.createEnv();
var args = process.argv.slice(2);

switch (args[0]) {
    case 'create':
        if (args[1] === 'app' || args[1] === 'service' || args[1] === 'vue') {
            env.register(require.resolve(`./generators/${args[1]}`), `brootal:${args[1]}`);
            env.run(`brootal:${args[1]}`);
            break;
        }
    case 'help':
    default:
        console.log('Return help')
        break;
}