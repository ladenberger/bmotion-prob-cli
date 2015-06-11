var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    mkdirp = require('mkdirp'),
    AdmZip = require('adm-zip');

var download = function (pfolder, version, filename, downloadUrl) {
    var tmpFolderPath = pfolder + "/tmp";
    var tmpFilePath = tmpFolderPath + "/" + filename;
    var toolFilePath = pfolder + "/tool/" + version;
    mkdirp(tmpFolderPath, function (err) {

        if (!err) {

            fs.exists(toolFilePath, function (exists) {

                if (!exists) {

                    console.log("Downloading BMotion Studio for ProB (" + version + ")");

                    var data = '', dataLen = 0;
                    var downloadInterval = setInterval(function () {
                        console.log("Download progress: " + dataLen + " bytes");
                    }, 1000);

                    var request = http.get(downloadUrl)
                        .on('error', function (e) {
                            console.log("Got error: " + e.message);
                        });
                    request.addListener('response', function (response) {
                        response.setEncoding('binary');
                        var downloadfile = fs.createWriteStream(tmpFilePath, {'flags': 'a'});
                        //console.log("File size " + filename + ": " + response.headers['content-length'] + " bytes.");
                        response.addListener('data', function (chunk) {
                            data += chunk;
                            dataLen += chunk.length;
                        });
                        response.addListener('end', function () {
                            console.log("Finished downloading BMotion Studio for ProB (" + version + ")");
                            downloadfile.write(data, 'binary');
                            downloadfile.end();
                            clearInterval(downloadInterval);
                            console.log("Extracting files ...");
                            var zip = new AdmZip(tmpFilePath);
                            zip.extractAllTo(pfolder + "/tool/" + version);
                            fs.unlink(tmpFilePath);
                        });
                    });
                    request.end();

                } else {
                    console.log("Latest version (" + version + ") of BMotion Studio for ProB already installed.");
                }

            });

        }
    });

};

var platform = process.platform;
var arch = process.arch.replace('x', '');

function run(pfolder) {

    var options = {
        host: 'nightly.cobra.cs.uni-duesseldorf.de',
        path: '/bmotion/bmotion-prob-standalone/releases/latest.txt'
    };
    var request = http.request(options, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            var latest = data.replace(/\n$/, '');
            var fileName = 'bmotion-prob-standalone-' + latest + '-' + platform + arch + ".zip";
            var url = 'http://nightly.cobra.cs.uni-duesseldorf.de/bmotion/bmotion-prob-standalone/releases/' + latest + '/' + fileName;
            download(pfolder, latest, fileName, url);
        });
    });
    request.on('error', function (e) {
        console.log(e.message);
    });
    request.end();


}
module.exports = run;