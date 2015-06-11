var inquirer = require("inquirer");
var fs = require('fs');

function run(pfolder) {

    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            default: 'MyVisualization',
            message: 'Name'
        },
        {
            name: 'tool',
            type: 'list',
            default: 'BAnimation',
            message: 'Formalism',
            choices: ['BAnimation', 'CSPAnimation']
        },
        {
            name: 'template',
            type: 'input',
            default: 'template.html',
            message: 'Template'
        },
        {
            name: 'model',
            type: 'input',
            default: 'model/model.mch',
            message: 'Model'
        }
    ], function (answers) {

        // Create bmosion.json manifest file
        fs.writeFile('bmotion.json', JSON.stringify(answers, null, 4), function (err) {
            if (err) {
                return console.log(err);
            }
        });

        var template = '<!DOCTYPE html>'
            + '<html data-bms-visualisation>\n'
            + '<head>\n'
            + '  <title>BMotion Studio for ProB: ' + answers.name + '</title>\n'
            + '</head>\n'
            + '<body>\n'
            + '  <script data-main="script" src="require.js"></script>\n'
            + '</body>\n'
            + '</html>';

        // Create template file
        fs.writeFile(answers.template, template, function (err) {
            if (err) {
                return console.log(err);
            }
        });
        //fs.createReadStream(pfolder + '/resources/' + answers.tool + '/' + 'template.html')
        //    .pipe(fs.createWriteStream(answers.template));

        // Create script.js file
        fs.createReadStream(pfolder + '/resources/' + answers.tool + '/' + 'script.js')
            .pipe(fs.createWriteStream('script.js'));
        // Create require.js library
        fs.createReadStream(pfolder + '/resources/' + answers.tool + '/' + 'require.js')
            .pipe(fs.createWriteStream('require.js'));
        // Create bmotion.vis.js library
        fs.createReadStream(pfolder + '/resources/' + answers.tool + '/' + 'bmotion.vis.js')
            .pipe(fs.createWriteStream('bmotion.vis.js'));

    });

}

module.exports = run;