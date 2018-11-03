# sql-to-mongo
Migrate data from sql database to mongo
=========

A simple node.js module that Migrate data from sql database to mongo

## Installation

  `npm install @emiliosel/sql-to-mongo`

## Usage

  const Migration = require('@emiliosel/sql-to-mongo');
  
  Config for mysql connection:

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

  Config for mysql connection:

    const monooseConfig = {
      host: 'localhost',
      port: '27017',
      database: 'myWorld'
    }

  Options for running migration of data:

    const options = {
      fromTable: 'city',
      toCollection: 'mongoCity',
      paginate: 1000,                            // paginate the query by 1000 items
      columns: {                                 // are the fields that will be created to collection
        title: {                                 // the name that will give to the field of collection
          type: String,                          // accepts all the types of mongoose.Schema         
          from: 'Name'                           // the column name from sql table
        },
        name: {
          type: String,
          from: 'Name'
        },
        countryCode: {                            // 'beforeSave' callback is called at mongoose
          type: String,                           // middleware post('validate') 
          from: 'CountryCode',
          beforeSave: async (doc, mongoose, knex) => { 

            doc.name = doc.name.toLowerCase()     // 'doc' is the current document that passed mongoose
                                                  // validation and is about to save
                                                  // we can change or format the properties of doc
          }
        },
        Population: {                             // here is not provided 'from' so the name of the
          type: Number                            // collection field 'Population' is the same with
        },                                        // sql column
        customColumn: {
          type: {                                 // custom field added to mongo collection that
            type: String,                         // does not exist to sql table
            default: 'test'                       // with default value 'test'
          },
          custom: true
        },
        anotherCustomField: {                      // custom field that we populate with a custom 
          type: Array,                             // query using knex. We could also use mongoose
          custom: true,                             
          beforeSave: async (doc, mongoose, knex) => {
            let someValues = await knex.select().from('someTable')
            doc['anotherCustomField'] = someValues
          }
        }
      }
    }

  Instantiate the Migration with the databases config:

    let migration = new Migration({
      sql: knexConfig,
      mongo: mongooseConfig
    })
    
  Run migration passing the options object as param:

    migration.up(options).then(() => {
      console.log('succesfully')
    })
    .catch((er) => {
      console.log('error')
      
    })

  Run delete created collection:

    migration.down().then(() => {
      console.log('ok')
    })
    .catch((er) => {
      console.log('error')
    })

  Run custom migration: 

    migration.up(async (knex, mongoose) => {
      let data = await knex.select().from('tableName')
      let schema = new mongoose.Schema({
        title: String,
        date: Date
      })
      let model = mongoose.model('ModelName', schema)
      await model.insertMany(data)
    })


## Tests

  `docker-compose up`

  `npm test`

