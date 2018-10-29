'use strict';
const connectMysql = require('./connectors/mysql')
const connectMongo = require('./connectors/mongo')
const Pagination = require('./helpers/pagination')
const consoleColor = require('./helpers/consoleColor')
const {
  buildMongooseModel
} = require('./helpers/mongoose')
const {
  buildSelect
} = require('./helpers/knex')
const {
  isObject
} = require('util')

const countMysqlData = async (table, knex) => {
  let countRes = await knex(table).count('id as count')
  return countRes[0].count
}

const validateConstructOptions = (options) => {
  let {
    sql,
    mongo
  } = options
  if (!sql || !mongo) throw new Error('You must specify sql and mongo credentials to proceed')
  return true
}

const validateMigrationOptions = (options) => {
  if (!options || !options.fromTable || !isObject(options.columns)) throw new Error('You must specify fromTable and columns. Also columns must be an Object!!')
}

module.exports = class Migration {

  constructor(options) {
    validateConstructOptions(options)
    this.sqlCredentials = options.sql
    this.mongoCredentials = options.mongo
    this.options = options
    this.knex = null
    this.mongoose = null
    this.pagination = null
    this.mongooseModel = null
  }

  async up(cb) {
    validateMigrationOptions(cb)

    if (cb instanceof Function) {
      await this._connectToDatabases()
      return cb(this.knex, this.mongoose)
    }

    if (isObject(cb)) {

      let self = new Migration({sql: this.sqlCredentials, mongo: this.mongoCredentials})
      self.knex = this.knex
      self.mongoose = this.mongoose
      self.options = cb

      console.time('MigrationUpTime')
      await self._connectToDatabases()
      await self._createPagination()
      self.mongooseModel = buildMongooseModel(self.options, self.mongoose)
      await self._runMigration()
      console.log(consoleColor('green'))
      console.timeEnd('MigrationUpTime')
      console.log(consoleColor('white'))
      return self
    }
  }

  _consoleLogStart() {
    console.log(consoleColor('magenta'), `Migrating data from table: ${this.options.fromTable}`)
    console.log(`To collection: ${this.options.toCollection || this.options.fromTable}`)
    console.log(`Total items to migrate: ${this.totalItems}`, consoleColor('white'))
  }

  async down(cb) {
    if (cb instanceof Function) {
      await this._connectToDatabases()
      return cb(this.knex, this.mongoose)
    }

    if (isObject(cb)) {
      let self = new Migration({sql: this.sqlCredentials, mongo: this.mongoCredentials})
      self.knex = this.knex
      self.mongoose = this.mongoose
      self.options = cb

      console.time('MigrationDownTime')
      await self._connectToDatabases()
      console.log(`Deleting all from collection: ${self.options.toCollection || self.options.fromTable}`)
      // if (!this.mongooseModel) {
        self.mongooseModel = buildMongooseModel(self.options, self.mongoose)
      // }
      await self.mongooseModel.deleteMany({})
      console.log(consoleColor('green'))
      console.timeEnd('MigrationDownTime')
      console.log(consoleColor('white'))
      return self
    }
  }

  async _createPagination() {
    this.totalItems = this.options.limit ? this.options.limit : await countMysqlData(this.options.fromTable, this.knex)
    this._consoleLogStart()
    if (this.options.paginate) {

      this.pagination = new Pagination({
        currentPage: 1,
        totalItems: this.totalItems,
        itemsPerPage: this.options.paginate
      })
      this.pagination.countDownTotalPages = this.pagination.totalPages
    }
  }

  _runMigration() {
    if (this.pagination) {
      return this._runPaginated()
    }
    return this._run()
  }

  async _runPaginated() {
    if (this.pagination) {
      // let paginatedRuns = []
      while (this.pagination.countDownTotalPages > 0) {
        console.log(consoleColor('cyan'))
        console.log(`Running paginated: ${this.pagination.currentPage}/${this.pagination.totalPages}`)
        console.log(consoleColor('white'))
        // paginatedRuns.push(this._run())
        await this._run()
        this.pagination.currentPage += 1 // change pagination current page to +1
        this.pagination.countDownTotalPages -= 1 // count down total pages
      }
      // await Promise.all(paginatedRuns)
    }
  }

  async _run() {
    let selectObj = buildSelect(this.options.columns)
    let dataFromSql
    if (this.pagination) {
      dataFromSql = await this.knex.select(selectObj).from(this.options.fromTable).limit(this.pagination.itemsPerPage).offset(this.pagination.getSkip())
    } else {
      dataFromSql = await this.knex.select(selectObj).from(this.options.fromTable)
    }

    let res = await this.mongooseModel.insertMany(dataFromSql)
  }

  async _connectToDatabases() {
    if (!this.knex || !this.mongoose) {
      console.log('Connecting to databases!!!')
      let [knex, mongoose] = await Promise.all([connectMysql(this.sqlCredentials), connectMongo(this.mongoCredentials)])
      this.knex = knex
      this.mongoose = mongoose
    }
  }
}
