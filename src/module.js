'use strict';
const connectMysql = require('./connectors/mysql')
const connectMongo = require('./connectors/mongo')
const Pagination = require('./helpers/pagination')
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

    if (cb instanceof Object) {
      console.time('MigrationUpTime')
      this.options = cb
      await this._connectToDatabases()
      await this._createPagination()
      this.mongooseModel = buildMongooseModel(this.options, this.mongoose)
      await this._runMigration()
      console.timeEnd('MigrationUpTime')
    }
  }

  _consoleLogStart() {
    console.log(`Migrating data from table: ${this.options.fromTable}`)
    console.log(`To collection: ${this.options.toCollection || this.options.fromTable}`)
    console.log(`Total items to migrate: ${this.totalItems}`)
  }

  async down(cb) {
    if (cb instanceof Function) {
      await this._connectToDatabases()
      return cb(this.knex, this.mongoose)
    }
    console.time('MigrationDownTime')
    console.log(`Deleting all from collection: ${this.options.toCollection || this.options.fromTable}`)
    if (!this.mongooseModel) {
      this.mongooseModel = buildMongooseModel(this.options, this.mongoose)
    }
    await this.mongooseModel.deleteMany({})
    console.timeEnd('MigrationDownTime')
  }

  async _createPagination() {
    this.totalItems = await countMysqlData(this.options.fromTable, this.knex)
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
      while (this.pagination.countDownTotalPages > 0) {
        console.log(`Running paginated: ${this.pagination.currentPage}/${this.pagination.totalPages}`)
        await this._run()
        this.pagination.currentPage += 1 // change pagination current page to +1
        this.pagination.countDownTotalPages -= 1 // count down total pages
      }
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
