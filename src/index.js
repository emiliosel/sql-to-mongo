import {
  connectMysql
} from './connectors/mysql';

import { connectMongo } from './connectors/mongo'
// import { buildSchemaObject, buildMongooseModel } from '../src/helpers/mongoose'
import { buildSelect } from '../src/helpers/knex'
import Pagination from './helpers/pagination'

// import Pagination from './helpers/pagination'

function migrate(config) {
  const {
    table,
  } = config;

  return table;
}

migrate({
  fromTable: 'articles',
  toCollection: 'articles',
  columns: {
    oldId: {
      type: String,
      from: 'id',
      embed: {
        type: Object,
        fromTable: 'categories',
        columns: {
          name: {
            type: String,
            from: 'title',
          },
        },
      },
    },
  },
});

export const buildSchemaObject = (columns) => {
  let schemaObj = {}
  for (let columnName in columns) {
    schemaObj[columnName] = columns[columnName].type ? columns[columnName].type : String
  }
  return schemaObj
}

export const buildMongooseModel = (options, mongoose) => {
  const { fromTable, columns, toCollection } = options
  let modelName = toCollection || fromTable
  let modelSchema = new mongoose.Schema(buildSchemaObject(columns), {versionKey: false});
  let model = mongoose.model(modelName, modelSchema)
  return model
}

const getDataFromSql = async (fromTable, columns, knex) => {
  let selectObj = buildSelect(columns)
  let data = await knex.select(selectObj).from(fromTable).limit(2)
  return data
}

const saveDataToMongo = async (data, mongooseModel) => {
  return await mongooseModel.insertMany(data)
}


const countMysqlData = async (table, knex) => {
  let countRes = await knex(table).count('id as count')
  return countRes[0].count
}

async function migratePaginated({knex, mongoose, mongooseModel, options, limit, offset}) {
  let { fromTable, columns } = options
  offset = offset || 0
  let selectObj = buildSelect(columns)
  let dataFromSql = await knex.select(selectObj).from(fromTable).limit(limit).offset(offset)

  let res = await saveDataToMongo(dataFromSql, mongooseModel)
  return res
}

export default {

  async run(options) {
    


    const { fromTable, columns } = options
    if (!columns) throw new Error('Select columns'); // todo ...
    let [ knex, mongoose ] = await this.connectToDatabases()
    let countRes = await knex(fromTable).count('id as count')
    let totalPages = countRes[0].count
    let mongooseModel = buildMongooseModel(options, mongoose)
    let dataFromSql = await getDataFromSql(fromTable, columns, knex)
    console.log({dataFromSql})
    let res = await saveDataToMongo(dataFromSql, mongooseModel)
    return res
  },

  async runPaginated(options) {
    const { fromTable, columns, paginate } = options
    if (!columns) throw new Error('Select columns'); // todo ...
    let [ knex, mongoose ] = await this.connectToDatabases()
    let mongooseModel = buildMongooseModel(options, mongoose)
    let totalItems = 4 //await countMysqlData(fromTable, knex)
    let itemsPerPage = paginate || 10
    let pagination = new Pagination({
      currentPage: 1,
      totalItems,
      itemsPerPage
    })
    pagination.countTotalPages = pagination.totalPages
    // pagination.countCurrentPage =
    while (pagination.countTotalPages > 0) {
      console.log(`Running paginated: ${pagination.currentPage}/${pagination.totalPages}`)
      let res = await migratePaginated({
        knex,
        mongooseModel,
        options,
        limit: itemsPerPage,
        offset: pagination.getSkip()
      })

      pagination.currentPage += 1 // change pagination current page to +1
      pagination.countTotalPages -= 1 // count down total pages
    }

  },

  addKnexConfig(config) {
    this.knexConfig = config
  },

  addMongooseConfig(config) {
    this.mongooseConfig = config
  },

  connectToDatabases() {
    return Promise.all([connectMysql(this.knexConfig), connectMongo(this.mongooseConfig)])
  }
}
