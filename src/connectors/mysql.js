const knex = require('knex');

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
    console.log('Connecting to mysql...')
    let sqlClient = knex(options)
    sqlClient.raw('select 1+1 as result')
      .then(() => {
        console.log('Connected to mysql!')
        res(sqlClient)
      })
      .catch((er) => {
        console.log('Error connecting to mysql')
        console.log(er)
        rej(er)
      })
  })
}
