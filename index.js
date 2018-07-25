
const dotenv = require('dotenv');

const bootBot = require('./app/bootBot');
const intents = require('./app/intents_reference');

/**
 * Prior getting the PORT, load the config first
 */
dotenv.config();

const PORT = process.env.PORT || 4000;

const bot = bootBot.start(PORT);
bootBot.registerIntents(bot, intents);