#! /usr/bin/env node
'use strict';

//process.bin = process.title = 'bmotion';

var commands = require('./lib');
var yargs = require('yargs')
        .usage('Usage: $0 <command> [options]')
        .command('version', 'Print the current version of the bmotion-prob-cli tool.')
        .command('install', 'Download the latest version of BMotion Studio for ProB.')
        .command('update', 'Update BMotion Studio for ProB to the latest version.')
        .command('run', 'Run a visualization.')
        .command('init', 'Initialize a new visualization template.')
        .command('online', 'Create online visualization.')
        .demand(1, 'must provide a valid command'),
    argv = yargs.argv,
    command = argv._[0];

if (command === 'version') {
//--------------------------------------------------------------
//bmotion version
//  Simply print the current version of the bmotion-prob-cli tool.
//--------------------------------------------------------------
    commands.version();

} else if (command === 'install') {
//--------------------------------------------------------------
//bmotion install
//  This command will download the latest version of BMotion Studio
//  for ProB (nw.js application). The application will be downloaded
//  into a subfolder of the bmotion-prob-cli node.js module.
//  Question: is it possible to determine the system and architecture?
//--------------------------------------------------------------
    yargs.reset()
        .usage('$0 install')
        .help('h')
        .example('$0 install', 'print the world message!')
        .argv
    console.log('install!');

} else if (command === 'update') {
//--------------------------------------------------------------
//bmotion update
//  Updates the BMotion Studio for ProB Client (nw.js application) to the
//  latest version if necessary.
//--------------------------------------------------------------
    yargs.reset()
        .usage('$0 update')
        .help('h')
        .example('$0 update', 'print the world message!')
        .argv
    console.log('update!');

} else if (command === 'run') {
//--------------------------------------------------------------
//bmotion run -v (--visualization)
//  Run a visualization. The user can point to a visualization with -v.
//  If no BMotion Studio for ProB (nw.js application) is installed,
//  download automatically the latest version of the tool.
//  The application will be downloaded into a subfolder of the
//  bmotion-prob-cli node.js module. Question: is it possible to
//  determine the system and architecture?
//
//  -v (optional): Specify the visualization that should be run.
//  If no visualization is defined the command will look for a
//  bmotion.json file in the current folder. If no visualization
//  was found, report an error.
//--------------------------------------------------------------
    yargs.reset()
        .usage('$0 run')
        //.demand('v') // v is optional
        .alias('v', 'visualization')
        .nargs('v', 1)
        .describe('v', 'Path to bmotion.json file')
        .help('h')
        .alias('h', 'help')
        .example('$0 run', '-v /path/to/bmotion.json')
        .argv
    console.log('Run command!');

} else if (command === 'init') {
//--------------------------------------------------------------
//bmotion init -o (--output) -n (--name) -t (--tool)
//  This command will create a new visualization template with
//  the name (-n) and for the tool (-t) in the folder defined with -o.
//
//  -o (optional): Specify the output path, there the visualization template
//  should be created. If no output path is defined the command will create
//  a the visualization template in the current folder.
//
//  -n (optional): Specify the name of the visualization.
//  If no name is defined, the default name "MyVisualization" is used.
//
//  -t (optional): Specify the tool of the visualization (BAnimation or
//  CSPAnimation). If no tool is defined, the default tool "BAnimation" is used.
//
//  We could also ask interactively the user for the parameters like name,
//  tool, template, model ... (see npm init).
//--------------------------------------------------------------

    /*yargs.reset()
     .usage('$0 run')
     //.demand('v') // v is optional
     .alias('o', 'output')
     .nargs('o', 1)
     .describe('o', 'Output path')
     .alias('n', 'name')
     .nargs('n', 1)
     .describe('n', 'Name of visualization')
     .alias('t', 'tool')
     .nargs('t', 1)
     .describe('t', 'Tool (BAnimation or CSPAnimation)')
     .help('h')
     .alias('h', 'help')
     .example('$0 init', '-o /my/vis -n MyVis -t BAnimation')
     .argv*/

    commands.init(__dirname);

} else if (command === 'online') {
//--------------------------------------------------------------
//bmotion online -v (--visualization) -o (--output) -s (--system)
//  Converts the given visualization (-v) to an ready for use online version.
//  In particular this means, that the command will download the latest binaries
//  for the server and put all things together.
//
//  -v (optional): Specify the visualization that should be converted to an online
//  visualization. If no visualization is defined the command will look for a
//  bmotion.json file in the current folder. If no visualization was found,
//  report an error.
//
//  -o (optional): Specify the output path, there the online version should be
//  created. If no output path is defined the command will create a subfolder
//  in the current folder (e.g. online).
//
//  -s (required): Specify the system and architecture of the server.
//  Available options are: linux64, linux32, osx64, win32. Do we really need this?
//--------------------------------------------------------------
    yargs.reset()
        .usage('$0 online')
        //.demand('v') // v is optional
        .alias('o', 'output')
        .nargs('o', 1)
        .describe('o', 'Output path')
        .alias('v', 'visualization')
        .nargs('v', 1)
        .describe('v', 'Path to bmotion.json file')
        .help('h')
        .alias('h', 'help')
        .example('$0 online', '-v /my/vis/bmotion.json -o /my/vis/online')
        .argv
    console.log('Online command!');
} else {
    yargs.showHelp();
}
