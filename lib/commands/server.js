var util = require('../util');

function run(folder, argv) {

    var cmd = argv._[1];

    if (cmd === 'start') {

        util.getDefaultVersion(folder).then(function (defaultVersion) {

            var toolPath = folder + '/tool/' + defaultVersion;
            var serverBin = toolPath + '/server/bin/standalone';

            console.log("Starting BMotion for ProB server ...");

            var exec = require('child_process').exec,
                child;

            child = exec(serverBin,
                function (error, stdout, stderr) {
                    console.log('stdout:', stdout);
                    console.log('stderr:', stderr);
                    if (error !== null) {
                        console.log('exec error:', error);
                    }
                });
            process.on('exit', function () {
                child.kill();
            });

        });

    } else if (cmd === 'stop') {

    }

}
module.exports = run;