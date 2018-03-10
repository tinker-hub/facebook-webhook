module.exports.hooks = hooks;

function hooks(bootbot) {
  
  bootbot.setGreetingText("Hello there, I'm here to help you manage your tasks. Be sure to setup your bucket by typing 'Setup'. ");
  bootbot.setGetStartedButton((payload, chat) => {
    if (!config.bucket) {
      chat.say('Hello my name is Kitty and I can help you keep track of your thoughts');
      chat.say("It seems like you have not setup your bucket settings yet. That has to be done before you can do anything else. Make sure to type 'setup'");
    }
    // BotUserId = payload.sender.id
  });

  bootbot.hear(['hello', 'hey', 'sup'], async (payload, chat) => {
    const user = await chat.getUserProfile();
    chat.say(`Hey ${user.first_name}, How are you today?`);
  });

  bootbot.hear('help', (payload, chat) => {
    chat.say('Here are the following commands for use.');
  });

  bootbot.hear('image', async (payload, chat) => {
    chat.say('Please wait, coming hot!');
    const user = await chat.getUserProfile();
    chat.say({
      attachment: 'image',
      url: user.profile_pic
    });
  });

  bootbot.hear('quick', (payload, chat) => {
    chat.say({
      text: 'Favorite color?',
      quickReplies: ['Red', 'Blue', 'Green']
    });
  });

  const regex = /DD-\d+/; 

  bootbot.hear(regex, (payload, chat) => {
    chat.say(`Got your task ${payload.message.text.match(regex)[0]}`);
  });
}