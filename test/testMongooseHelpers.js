
// const expect = require('chai').expect;
// import { buildSchemaObject, buildMongooseModel } from '../src/helpers/mongoose'
// import { connectMongo } from '../src/connectors/mongo'
// describe('Check mongoose helpers', () => {

//   it('should return correct schema object to use with mongoose', () => {
//     let columns = {
//       key: {
//         type: String,
//         from: 'id'
//       },
//       name: {
//         type: Object
//       },
//       surname: {
//         from: 'last_name'
//       }
//     }

//     let expectedObj = {
//       key: String,
//       name: Object,
//       surname: String
//     }
//     let schemObj = buildSchemaObject(columns)
//     console.log({schemObj})
//     expect(schemObj).to.deep.equal(expectedObj)
//   })

//   it('should return correct mongoose model object', () => {

//     const config = {
//       host: 'localhost',
//       port: '27017',
//       user: 'root',
//       password: '',
//       database: 'mydb3'
//     }

//     let options= {
//       fromTable: 'articles',
//       toCollection: 'post',
//       columns: {
//         oldId: {
//           type: String,
//           from: 'id'
//         },
//         name: {
//           type: Object,
//           from: 'title'
//         },
//         surname: {
//           from: 'last_name'
//         }
//       }
//     }
//     return connectMongo(config).then(mongoose => {
//       let model = buildMongooseModel(options, mongoose)
//       expect(model).to.have.a.property('insertMany')
//     })
//   })

// })
