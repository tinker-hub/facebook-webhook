const _ = require('lodash');

const intents = require('../intents_reference');

module.exports = (bootBot) => {
  
  bootBot.hear(intents.basic.intents, async (payload, chat) => {
    const userProfile = await getUserProfile(chat);
    const intentResponse = userProfile.first_name;
    chat.say(stringReplacer(intents.basic.response, intentResponse), intents.basic.options);
  });
};

async function getUserProfile(chat) {
  if (!chat) return {};
  return chat.getUserProfile();
}

function stringReplacer(stringToReplace, value) {
  return stringToReplace.replace('%@', value);
}