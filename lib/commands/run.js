var util = require('../util'),
    fs = require('fs');

function run(folder) {

    util.getDefaultVersion(folder).then(function (defaultVersion) {

        var toolPath = folder + '/tool/' + defaultVersion;

        fs.exists('bmotion.json', function (exists) {

            if (exists) {

                fs.readFile('bmotion.json', 'utf8', function (err) {
                    if (err) {
                        util.printBMSError(err);
                    } else {
                        var currentDir = process.cwd();
                        var serverBin = toolPath + '/bmotion-prob ' + currentDir + '/bmotion.json &';
                        var exec = require('child_process').exec;
                        exec(serverBin,
                            function (error, stdout, stderr) {
                                util.printBMSMessage(stdout);
                                util.printBMSError(stderr);
                                if (error !== null) {
                                    util.printBMSError(error);
                                }
                            });
                        process.exit();
                    }
                });

            } else {
                util.printBMSMessage("No bmotion.json manifest file found in current folder!");
            }

        });

    });

}
module.exports = run;