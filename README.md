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
      model.insertMany(data)
    })


## Tests

  `docker-compose up`

  `npm test`

