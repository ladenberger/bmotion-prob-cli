#! /usr/bin/env node
'use strict';

var commandList = {
    version: 'Print the current version of the bmotion-prob-cli tool.',
    install: 'Download the latest version of BMotion Studio for ProB.',
    update: 'Update BMotion Studio for ProB to the latest version.',
    default: 'Set default version of BMotion Studio for ProB.',
    run: 'Run a visualization.',
    init: 'Initialize a new visualization template.'
    //,online: 'Create online visualization.'
};
var pfolder = __dirname;

var commands = require('./lib');
var yargs = require('yargs')
        .usage('Usage: $0 <command> [options]')
        .demand(1, 'must provide a valid command'),
    argv = yargs.argv,
    command = argv._[0];

for (var cmd in commandList) {
    yargs.command(cmd, commandList[cmd]);
}

if (commandList[command]) {

    if (command === 'server') {
        var serverArgs = yargs.reset()
            .command('start', 'Start server')
            .command('stop', 'Stop server')
            .example('$0 server start')
            .example('$0 server stop')
            .demand(2, 'must provide a valid command')
            .argv;
        if (argv._[1] !== 'start' && argv._[1] !== 'stop') {
            console.log('Please provide a valid command!\n');
            yargs.showHelp();
            process.exit();
        }
    }
    commands[command](pfolder, argv);

} else {

}

//--------------------------------------------------------------
//bmotion version
//  Simply print the current version of the bmotion-prob-cli tool.
//--------------------------------------------------------------
//--------------------------------------------------------------
//bmotion install
//  This command will download the latest version of BMotion Studio
//  for ProB (nw.js application). The application will be downloaded
//  into a subfolder of the bmotion-prob-cli node.js module.
//  Question: is it possible to determine the system and architecture?
//--------------------------------------------------------------
//--------------------------------------------------------------
//bmotion update
//  Updates the BMotion Studio for ProB Client (nw.js application) to the
//  latest version if necessary.
//--------------------------------------------------------------
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
