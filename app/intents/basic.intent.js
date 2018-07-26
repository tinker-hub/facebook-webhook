const _ = require('lodash');
const request = require('request');

const intents = require('../intents_reference');
const stations = require('../data/stations.json');

module.exports = (bootBot) => {
  
  bootBot.hear(intents.basic.intents, async (payload, chat) => {
    const userProfile = await getUserProfile(chat);

    const askStation = (convo) => {
      const question = {
        text: `What station are you going?`,
        quickReplies: ['Edsa', 'Doroteo Jose', 'Monumento']
      };
      convo.ask(question, async (payload, convo, data) => {
        const text = payload.message.text;
        const station = _.find(stations, (station) => _.isEqual(_.lowerCase(station.name), _.lowerCase(text))) || false;
        if (station) {
          convo.say(`So you are going to ${station.name}`);
          convo.say(`Hold on, I will see the station's status...`);
          
          await convo.sendTypingIndicator(1000);
          const stationDensityStatus = await getDensityStatus(station.name);
          convo.say(stationDensityStatus)
            .then(() => {
              convo.say(`Thank you for using TrainSeet! Have a safe trip ${ convo.get('name') }`);
              convo.end();
            });
        } else {
          convo.say(`Sorry didn't quite get that.`);
          convo.end();
        }
      });
    };

    const askUserFeeling = (convo, userFirstName) => {
      const quickReplies = ['Good', 'OK', 'Ready to ride'];
      const question = {
        text: `Hey ${convo.get('name')}, how are you today?`,
        quickReplies
      };
      convo.ask(question, (payload, convo, data) => {
        const text = payload.message.text;
        const isAnswerFamiliar = _.includes(quickReplies, text);
        if (isAnswerFamiliar) {
          convo.say(`Ohh that's good to hear, ${ convo.get('name') }`)
            .then(() => askStation(convo));
        } else {
          convo.say(`Sorry didn't quite get that.`);
          convo.end();
        }
      });
    };

    chat.conversation((convo) => {
      const userFirstName = userProfile.first_name;
      convo.set('name', userFirstName);
      convo.sendTypingIndicator(1000).then(() => askUserFeeling(convo));
    });
  });
};

async function getUserProfile(chat) {
  if (!chat) return {};
  return chat.getUserProfile();
}

async function getDensityStatus(station = '') {
  const url = 'https://trainseet.tk/api/density';
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (err) return reject(err);
      if (!body) body = `{"0":0,"density":15}`;
      const density = parseInt(JSON.parse(body).density);
      const statuses = {
        LIGHT: 'As of now, there are a few people in ${station}',
        MODERATE: 'As of now, there are moderate people in ${station}',
        HIGH: 'As of now, there are a lot of people in ${station}'
      };
      const status = density <= 20 ? 
        statuses.LIGHT : density >= 21 && density <= 60 ? 
        statuses.MODERATE : density >= 61 ? 
        statuses.HIGH : statuses.LIGHT;
      resolve(status.replace('${station}', station));
    });
  });
}