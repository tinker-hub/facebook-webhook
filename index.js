
const dotenv = require('dotenv');

const bootBot = require('./app/bootBot');
const intents = require('./app/intents_reference');

const PORT = process.env.PORT || 4000;

dotenv.config();

const bot = bootBot.start(PORT);
bootBot.registerIntents(bot, intents);