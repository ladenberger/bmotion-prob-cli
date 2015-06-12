module.exports = {
    version: require('./commands/version'),
    install: require('./commands/install'),
    update: require('./commands/update'),
    default: require('./commands/default'),
    server: require('./commands/server'),
    run: require('./commands/run'),
    init: require('./commands/init')
};