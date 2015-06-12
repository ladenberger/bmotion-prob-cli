var http = require('http'),
    fs = require('fs'),
    url = require('url'),
    mkdirp = require('mkdirp'),
    AdmZip = require('adm-zip'),
    Q = require('q');

var platform = process.platform,
    arch = process.arch.replace('x', '');

var downloadAndExtract = function (folder, version) {

    var deferred = Q.defer(),
        tmpFolderPath = folder + "/tmp",
        latestFileName = 'bmotion-prob-standalone-' + version + '-' + platform + arch + ".zip",
        tmpFilePath = tmpFolderPath + "/" + latestFileName,
        toolPath = folder + '/tool/' + version;

    mkdirp(tmpFolderPath, function (err) {

        if (err) deferred.reject(err);

        console.log("Downloading BMotion Studio for ProB (" + version + ")");
        var data = '', dataLen = 0;
        var downloadInterval = setInterval(function () {
            console.log("Download progress: " + dataLen + " bytes");
        }, 1000);
        var request = http.get('http://nightly.cobra.cs.uni-duesseldorf.de/bmotion/bmotion-prob-standalone/releases/' + version + '/' + latestFileName)
            .on('error', function (e) {
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
                console.log("Finished downloading BMotion Studio for ProB (" + version + ")");
                downloadfile.write(data, 'binary');
                downloadfile.end();
                clearInterval(downloadInterval);
                console.log("Extracting files ...");
                var zip = new AdmZip(tmpFilePath);
                zip.extractAllTo(toolPath, true);
                fs.unlink(tmpFilePath);
                // Make binaries executable ...
                fs.chmodSync(toolPath + '/server/bin/standalone', '755');
                fs.chmodSync(toolPath + '/client/bmotion-prob', '755');
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
        path: '/bmotion/bmotion-prob-standalone/releases/latest'
    };
    var request = http.request(options, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            deferred.resolve(data.replace(/\n$/, ''));
        });
    });
    request.on('error', function (e) {
        deferred.reject(e);
    });
    request.end();
    return deferred.promise;
};

function run(folder) {
    getLatestVersion().then(function (latestVersion) {
        downloadAndExtract(folder, latestVersion)
            .then(setDefaultVersion(folder, latestVersion));
    });
}
module.exports = run;