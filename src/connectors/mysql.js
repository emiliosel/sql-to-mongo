const knex = require('knex');
const consoleColor = require('../helpers/consoleColor')
const testconfig = {
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: '8889',
    user: 'root',
    password: '123',
    database: 'newpost_v2db'
  }
}

/**
 * Returns promise that when resolves return
 * instance of knex connected to database
 *
 * @param {*} options
 */
module.exports = function connectMysql(options) {
  return new Promise((res, rej) => {
    console.log(consoleColor('yellow'), 'Connecting to mysql...', consoleColor('white'))
    let sqlClient = knex(options)
    sqlClient.raw('select 1+1 as result')
      .then(() => {
        console.log(consoleColor('green'), 'Connected to mysql successfully!', consoleColor('white'))
        res(sqlClient)
      })
      .catch((er) => {
        console.log(consoleColor('red'), 'Error connecting to mysql!', consoleColor('white'))
        console.log(consoleColor('red'), er, consoleColor('white'))
        rej(er)
      })
  })
}
