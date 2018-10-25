// 'use strict';

// const expect = require('chai').expect;
// import {
//   connectMysql
// } from '../src/connectors/mysql';

// import { connectMongo } from '../src/connectors/mongo'

// describe('mysqlConnector', function () {
//   const config = {
//     client: 'mysql',
//     connection: {
//       host: 'localhost',
//       port: '8889',
//       user: 'root',
//       password: '123',
//       database: 'newpost_v2db'
//     }
//   }
//   it('should connect to database and return an instance of knex', function () {
//     return connectMysql(config).then(dbInstance => {
//       expect(dbInstance).to.have.a.property('select')
//     })
//   });

//   it('should not connect and throw error (bad credentials)', function () {
//     return connectMysql({
//       client: 'mysql',
//       connection: {
//         host: 'localhost',
//         port: '8889',
//         user: '',
//         password: '',
//         database: 'newpost_v2db'
//       }
//     }).catch(er => {
//       expect(er).to.be.an('error');
//     })
//   });
// });


// describe('mongoConnector', function () {
//   const config = {
//       host: 'localhost',
//       port: '27017',
//       user: 'root',
//       password: '',
//       database: 'mydb3'
//     }
//   it('should connect to database and return an instance of mongoose', function () {
//     return connectMongo(config).then(mongoose => {
//       expect(mongoose).to.have.a.property('Schema')
//     })
//   });

//   it('should not connect and throw error (bad credentials)', function () {
//     return connectMongo({
//         host: 'localhost',
//         port: '8889',
//         user: '',
//         password: '',
//         database: 'newpost_v2db'
//     }).catch(er => {
//       expect(er).to.be.an('error');
//     })
//   });
// });
