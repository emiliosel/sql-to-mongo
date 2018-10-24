'use strict';

const expect = require('chai').expect;
import {
  connectMysql
} from '../src/connectors/mysql';


describe('mysqlConnector', function () {
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
  it('should connect to database and return an instance of knex', function () {
    return connectMysql(config).then(dbInstance => {
      expect(dbInstance).to.have.a.property('select')
    })
  });

  it('should not connect and throw error (bad credentials)', function () {
    return connectMysql({
      client: 'mysql',
      connection: {
        host: 'localhost',
        port: '8889',
        user: '',
        password: '',
        database: 'newpost_v2db'
      }
    }).catch(er => {
      expect(er).to.be.an('error');
    })
  });
});
