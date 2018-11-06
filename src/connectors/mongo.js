const mongoose = require('mongoose')
const consoleColor = require('../helpers/consoleColor')

let previousQueryString = ''

const buildQueryString = ({
  host,
  port,
  user,
  password,
  database
}) => {
  host = host || 'localhost'
  port = port || '27017'
  password = password || ''
  let authenticationString = (user && password) ? `${user}:${password}@` : ''
  if (!database) throw Error('Should specify a databse which you want to connect')

  return `mongodb://${authenticationString}${host}:${port}/${database}`
}

module.exports = function connectMongo(options) {
  return new Promise((res, rej) => {
    console.log(consoleColor('yellow'), 'Connecting to mongo...', consoleColor('white'))
    let queryString = buildQueryString(options)

    if (mongoose.connection.readyState == 1 && previousQueryString === queryString) {
      console.log(consoleColor('green'), "Connected to mongo Successfully!", consoleColor('white'));
      return res(mongoose)
    }

    mongoose.connect(queryString, {
      useNewUrlParser: true,
      useCreateIndex: true,
      poolSize: 15
    });
    const db = mongoose.connection

    db.once('open', () => {
      console.log(consoleColor('green'), "Connected to mongo Successfully!", consoleColor('white'));
      previousQueryString = queryString
      res(mongoose)
    })

    db.on('error', (er) => {
      console.log(consoleColor('red'), 'Connection to mongo error!', consoleColor('white'))
      rej(er)
    })
  })
}
