const _ = require('lodash');
const request = require('request');

const intents = require('../intents_reference');
const stations = require('../data/stations.json');

module.exports = (bootBot) => {
  
  bootBot.hear(intents.basic.intents, async (payload, chat) => {
    const userProfile = await getUserProfile(chat);

    chat.conversation((convo) => {
      const userFirstName = userProfile.first_name;
      const quickReply = {
        0: ['Good', 'OK', 'Ready to ride the train!']
      };
      const askOption = { typing: true };
      
      const form = {
        questionIndex: 0,
        question: (questionIndex) => {
          return {
            text: `Hey ${userFirstName}, how are you today?`,
            quickReplies: quickReply[questionIndex]
          }
        },
        answer: (questionIndex) => {
          return (payload, convo) => {
            const payloadAnswer = payload.message.text;
            const questionQuickReply = quickReply[questionIndex];
            const isAnswerFamiliar = _.includes(questionQuickReply, payloadAnswer);
            if (isAnswerFamiliar) {
              convo.ask('What station do you want to go?', async (payload, convo) => {
                const payloadAnswer = payload.message.text;
                const station = _.find(stations, (station) => _.isEqual(_.lowerCase(station.name), _.lowerCase(payloadAnswer))) || false;
                if (station) {
                  convo.say(`So you are going to ${station.name}`);
                  convo.say(`Hold on, I will see the station's status...`);
                  const stationDensityStatus = await getDensityStatus(station.name);
                  convo.say(stationDensityStatus);
                  convo.say(`Thank you for using TrainSeet! Have a safe trip ${ convo.get('name') }`);
                  convo.end();
                } else {
                  convo.say(`Sorry didn't quite get that.`);
                  convo.end();
                }
              }, askOption);
            }
            else 
              convo.say(`Sorry didn't quite get that.`);
              convo.end();
          }
        }
      };

      convo.set('name', userFirstName);
      convo.ask(form.question(form.questionIndex), form.answer(form.questionIndex), askOption);
    });
  });
};

async function getUserProfile(chat) {
  if (!chat) return {};
  return chat.getUserProfile();
}

function stringReplacer(stringToReplace, value) {
  return stringToReplace.replace('%@', value);
}

async function getDensityStatus(station = '') {
  const url = 'https://trainseet.tk/density';
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (err) return reject(err);
      if (!body) body = `{"0":0,"density":15}`;
      const density = parseInt(JSON.parse(body).density);
      const densityMock = [
        { station: 'Edsa', density: 60, status: 'HIGH' },
        { station: 'Doroteo Jose', density: 20, status: 'LIGHT' },
        { station: 'Monumento', density: 40, status: 'MODERATE' }
      ];
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