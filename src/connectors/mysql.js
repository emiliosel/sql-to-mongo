const knex = require('knex');

const config = {
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
export const connectMysql = (options) => {
  return new Promise((res, rej) => {
    let sqlClient = knex(options)
    sqlClient.raw('select 1+1 as result')
    .then(() => {
      res(sqlClient)
    })
    .catch((er) => {
      rej(er)
    })
  })
}
