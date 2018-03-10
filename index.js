const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const Cosmic = require('cosmicjs')
const BootBot = require('bootbot')
const chrono = require('chrono-node')
const schedule = require('node-schedule')
const EventEmitter = require('events').EventEmitter
const bootHooks = require('./bot.hooks');
const eventEmitter = new EventEmitter()

/**
 * Loads the .env to the process.env
 */
require('dotenv').config()

app.set('port', (process.env.PORT || 5000))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.redirect('https://www.facebook.com/Na-Santos-Dre-191598887555824/');
});

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    return res.send(req.query['hub.challenge'])
  }
  res.send('wrong token')
});

app.listen(app.get('port'), function () {
  console.log('Started on port', app.get('port'))
});


const bot = new BootBot({
  accessToken: process.env.ACCESS_TOKEN,
  verifyToken: process.env.VERIFY_TOKEN,
  appSecret: process.env.APP_SECRET
});

bootHooks.hooks(bot);
bot.start();