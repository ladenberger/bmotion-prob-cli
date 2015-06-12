var util = require('../util'),
    fs = require('fs'),
    path = require('path');

function run(folder) {

    util.getDefaultVersion(folder).then(function (defaultVersion) {

        var toolPath = folder + '/tool/' + defaultVersion;

        fs.exists('bmotion.json', function (exists) {

            if (exists) {

                fs.readFile('bmotion.json', 'utf8', function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        var currentDir = process.cwd();
                        var serverBin = toolPath + '/client/bmotion-prob ' + currentDir + '/bmotion.json &';
                        var exec = require('child_process').exec;
                        exec(serverBin,
                            function (error, stdout, stderr) {
                                console.log('stdout:', stdout);
                                console.log('stderr:', stderr);
                                if (error !== null) {
                                    console.log('exec error:', error);
                                }
                            });
                        process.exit();
                    }
                });

            } else {

                console.log("No bmotion.json manifest file found in current folder!");

            }

        });

    });

}
module.exports = run;