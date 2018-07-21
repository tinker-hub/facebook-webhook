module.exports = {
  showGreeting: true,
  greeting: `Hello there. I'm your bot for today. How can I help you?`,
  persistentMenu: {
    isEnable: true,
    menus: [
      {
        type: 'postback',
        title: 'Help',
        payload: 'PERSISTENT_MENU_HELP'
      },
      {
        type: 'web_url',
        title: 'Go to Website',
        url: 'https://github.com/tinker-hub/trainseet-server'
      }
    ]
  },
  basic: {
    intents: [
      'hi',
      'hello',
      'hey',
      'sup'
    ],
    response: `Hey %@, how are you today?`,
    options: {
      typing: true
    }
  },
  help: {
    intents: [
      'help',
      'need help'
    ],
    response: 'Here are the following commands for use.',
    options: {
      typing: true
    }
  }
}