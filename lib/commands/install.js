var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    mkdirp = require('mkdirp'),
    AdmZip = require('adm-zip'),
    Q = require('q'),
    util = require('../util');

var downloadAndExtract = function (folder, version) {

    var deferred = Q.defer(),
        tmpFolderPath = folder + "/tmp",
        latestFileName = 'bmotion-prob-standalone-' + version + '-' + util.getPlatformString() + ".zip",
        tmpFilePath = tmpFolderPath + "/" + latestFileName,
        toolPath = folder + '/tool/' + version;

    mkdirp(tmpFolderPath, function (err) {

        if (err) deferred.reject(err);

        util.printBMSMessage("Downloading BMotion Studio for ProB (" + version + ")");
        var data = '', dataLen = 0;
        var downloadInterval = setInterval(function () {
            util.printBMSMessage("Download progress: " + dataLen + " bytes");
        }, 1000);
        var request = http.get('http://nightly.cobra.cs.uni-duesseldorf.de/bmotion/bmotion-prob-standalone/releases/' + version + '/' + latestFileName)
            .on('error', function (e) {
                util.printBMSError('Could not download BMotion Studio for ProB (Problem with request: ' + e.message + ')');
                deferred.reject(e);
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
                util.printBMSMessage("Finished downloading BMotion Studio for ProB (" + version + ")");
                downloadfile.write(data, 'binary');
                downloadfile.end();
                clearInterval(downloadInterval);
                util.printBMSMessage("Extracting files ...");
                var zip = new AdmZip(tmpFilePath);
                zip.extractAllTo(toolPath, true);
                fs.unlink(tmpFilePath);
                // Make binary executable ...
                fs.chmodSync(toolPath + '/bmotion-prob', '755');
                deferred.resolve();
            });
        });
        request.end();

    });

    return deferred.promise;

};

var setDefaultVersion = function (folder, version) {
    var deferred = Q.defer();
    fs.writeFile(folder + '/config.json', JSON.stringify({default: version}, null, 4), function (err) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve();
        }
    });
    return deferred.promise;
};

var getLatestVersion = function () {
    var deferred = Q.defer();
    var options = {
        host: 'nightly.cobra.cs.uni-duesseldorf.de',
        path: '/bmotion/bmotion-prob-standalone/releases/latest.txt'
    };
    var request = http.request(options, function (res) {
        if (res.statusCode === 404) {
            util.printBMSError('Could not download BMotion Studio for ProB (Server not available, Status ' + res.statusCode + ')');
            deferred.reject();
        }
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            deferred.resolve(data.replace(/\n$/, ''));
        });
    });
    request.on('error', function (e) {
        util.printBMSError('Could not download BMotion Studio for ProB (Problem with request: ' + e.message + ')');
        deferred.reject(e);
    });
    request.end();
    return deferred.promise;
};

function run(folder) {
    getLatestVersion()
        .then(function (latestVersion) {
            downloadAndExtract(folder, latestVersion)
                .then(setDefaultVersion(folder, latestVersion));
        });
}
module.exports = run;