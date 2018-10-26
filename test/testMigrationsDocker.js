'use strict';

const expect = require('chai').expect;
const Migration = require('../src/module')

const knexConfig = {
  client: 'mysql',
  connection: {
    host: '0.0.0.0',
    port: '3306',
    user: 'root',
    password: 'secret',
    database: 'world'
  }
}

const monooseConfig = {
  host: 'localhost',
  port: '27017',
  database: 'myWorld'
}

const options = {
  fromTable: 'city',
  toCollection: 'mongoCity',
  paginate: 1000,
  columns: {
    title: {
      type: String,
      from: 'Name'
    },
    name: {
      type: String,
      from: 'Name'
    },
    countryCode: {
      type: String,
      from: 'CountryCode'
    },
    Population: {
      type: Number
    }
  }
}

describe('Migration with docker images for mysql', function () {
  context('Testing Migration.up(options)', () => {
    it('should migrate up from table city to collection mongoCity', function () {

      let migration = new Migration({
        sql: knexConfig,
        mongo: monooseConfig
      })
      migration.up(options).then(() => {
        expect('ok').to.equal('ok')
      })
    });
  })

  context('Testing Migration.up(options)', () => {
    it('should migrate down deleting all from table mongoCity', function () {

      let migration = new Migration({
        sql: knexConfig,
        mongo: monooseConfig
      })
      migration.up(options).then(() => {
        console.log('Yeah')
        console.timeEnd('checkMigration')
        migration.down().then(() => {
          expect('ok').to.equal('ok')
        })
      })
    });
  })
});
