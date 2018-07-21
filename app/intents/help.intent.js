const intents = require('../intents_reference');

module.exports = (bootBot) => {
  
  bootBot.hear(intents.help.intents, (payload, chat) => {
    chat.say(intents.help.response, intents.help.options);
  });
};