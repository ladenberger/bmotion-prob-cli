module.exports = {
    version: require('./commands/version'),
    install: require('./commands/install'),
    update: require('./commands/update'),
    default: require('./commands/default'),
    run: require('./commands/run'),
    init: require('./commands/init')
};