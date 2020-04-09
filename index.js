const config = require('./config')
const Twit = require('twit');

const T = new Twit(config);

T.post('statuses/update', {status: 'hola mundo'});
