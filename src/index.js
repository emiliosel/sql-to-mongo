import {
  connectMysql
} from './connectors/mysql';

import { connectMongo } from './connectors/mongo'
// import { buildSchemaObject, buildMongooseModel } from '../src/helpers/mongoose'
import { buildSelect } from '../src/helpers/knex'

import Pagination from './helpers/pagination'

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

async function migrate(options) {
  const { fromTable, columns } = options
  if (!columns) throw new Error('Select columns'); // todo ...
  let [ knex, mongoose ] = await this.connectToDatabases()
  let mongooseModel = buildMongooseModel(options, mongoose)
  let dataFromSql = await getDataFromSql(fromTable, columns, knex)
  console.log({dataFromSql})
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
