'use strict';

const expect = require('chai').expect;
import {
  connectMysql
} from '../src/connectors/mysql';

import { connectMongo } from '../src/connectors/mongo'

import Migration from '../src/index'

describe('Migration', function () {

  it('should connect to databases', function () {
    const knexConfig = {
      client: 'mysql',
      connection: {
        host: 'localhost',
        port: '8889',
        user: 'root',
        password: '123',
        database: 'newpost_v2db'
      }
    }

    const monooseConfig = {
      host: 'localhost',
      port: '27017',
      database: 'mydb3'
    }

    Migration.addKnexConfig(knexConfig)
    Migration.addMongooseConfig(monooseConfig)

    return Migration.connectToDatabases().then(ar => {
      expect(ar).to.have.a('array')
    })
  });

  it('should not connect to databases and throw error (bad credentials)', function () {
    const knexConfig = {
      client: 'mysql',
      connection: {
        host: 'localhost',
        port: '8889',
        user: 'root',
        password: '123',
        database: 'newpost_v2db'
      }
    }

    const monooseConfig = {
      host: 'localhost',
      port: '27012317',
      database: 'mydb3'
    }
    Migration.addKnexConfig(knexConfig)
    Migration.addMongooseConfig(monooseConfig)

    return Migration.connectToDatabases().catch(er => {
      expect(er).to.be.an('error');
    })
  });

  // it('should connect to databases and return the knex and mongoose objects', function () {
  //   const knexConfig = {
  //     client: 'mysql',
  //     connection: {
  //       host: 'localhost',
  //       port: '8889',
  //       user: 'root',
  //       password: '123',
  //       database: 'newpost_v2db'
  //     }
  //   }

  //   const monooseConfig = {
  //     host: 'localhost',
  //     port: '27017',
  //     database: 'mydb3'
  //   }
  //   Migration.addKnexConfig(knexConfig)
  //   Migration.addMongooseConfig(monooseConfig)

  //   return Migration.run().then(obj => {
  //     expect(obj.knex).to.have.a.property('select')
  //   })
  // });

  it('should migrate from table articles the columns id as oldId slug and date to collection posts', function () {
    const knexConfig = {
      client: 'mysql',
      connection: {
        host: 'localhost',
        port: '8889',
        user: 'root',
        password: '123',
        database: 'newpost_v2db'
      }
    }

    const monooseConfig = {
      host: 'localhost',
      port: '27017',
      database: 'mydb3'
    }

    const options = {
      fromTable: 'articles',
      toCollection: 'post',
      paginate: 1,
      columns: {
        oldId: {
          type: String,
          from: 'id'
        },
        slug: {
          type: String,
        },
        date: {
          type: Date
        }
      }
    }
    Migration.addKnexConfig(knexConfig)
    Migration.addMongooseConfig(monooseConfig)

    return Migration.runPaginated(options).then(res => {
      console.log({res})
      expect('ok').to.equal('ok')
    }).catch(() => {
      expect('ok').to.equal('not Ok')
    })
  });
});
