'use strict';

const expect = require('chai').expect;

import Migration from '../src/index'

describe('Migration docker', function () {

  it('should migrate from table articles the columns id as oldId slug and date to collection posts', function () {
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
    Migration.addKnexConfig(knexConfig)
    Migration.addMongooseConfig(monooseConfig)

    return Migration.run(options).then(res => {
      console.log({res})
      expect('ok').to.equal('ok')
    }).catch(() => {
      expect('ok').to.equal('not Ok')
    })
  });
});
