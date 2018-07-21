const BootBot = require('bootbot');
const _ = require('lodash');

const basicIntent = require('./intents/basic.intent');
const helpIntent = require('./intents/help.intent');

module.exports = {
  start: (port = 3000) => {
    const bot = new BootBot({
      accessToken: process.env.ACCESS_TOKEN,
      verifyToken: process.env.VERIFY_TOKEN,
      appSecret: process.env.APP_SECRET,
      webhook: '/webhook'
    });
    bot.start(port);
    return bot;
  },
  registerIntents: (bootBot, intents = {}) => {
    if (intents.showGreeting) {
      bootBot.setGreetingText(intents.greeting);
    }
    if (intents.persistentMenu && intents.persistentMenu.isEnable && intents.persistentMenu.menus) {
      bootBot.setPersistentMenu(intents.persistentMenu.menus);
    }

    basicIntent(bootBot);
    helpIntent(bootBot);
  }
}