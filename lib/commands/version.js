var pkg = require('../../package.json');

function run() {
    util.printBMSMessage(pkg.version);
}

module.exports = run;