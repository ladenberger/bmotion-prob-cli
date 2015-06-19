var inquirer = require("inquirer");
var fs = require('fs');

function run(pfolder) {

    fs.readdir(pfolder + '/tool', function (err, files) {

        inquirer.prompt([
            {
                name: 'default',
                type: 'list',
                choices: files,
                message: 'Set default version'
            }
        ], function (answers) {
            // Simply write to file ...
            fs.writeFile(pfolder + '/config.json', JSON.stringify(answers, null, 4), function (err) {
                if (err) {
                    return util.printBMSError(err);
                }
            });
        });

    });

}

module.exports = run;