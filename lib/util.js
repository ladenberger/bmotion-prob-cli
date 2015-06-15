var fs = require('fs'),
    Q = require('q');

var getDefaultVersion = function (folder) {
    var deferred = Q.defer();
    fs.readFile(folder + '/config.json', 'utf8', function (err, data) {
        if (err) {
            console.log('No BMotion Studio for ProB found. You can install the latest version with\n');
            console.log('     bmotion install');
            deferred.reject();
        } else {
            var obj = JSON.parse(data);
            var defaultVersion = obj.default;
            if (defaultVersion) {
                deferred.resolve(defaultVersion);
            } else {
                deferred.reject();
            }
        }
    });
    return deferred.promise;
};

var getPlatformString = function () {
    var platform = process.platform,
        arch = process.arch.replace('x', '').replace('ia', '');
    if (platform === 'win32') {
        platform = 'win';
    } else if (platform === 'darwin') {
        platform = 'osx';
    }
    return platform + arch;
};

module.exports = {
    getDefaultVersion: getDefaultVersion,
    getPlatformString: getPlatformString
};
