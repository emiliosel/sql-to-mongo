const buildMongoSchemaObject = (columns) => {
  let schemaObj = {}
  for (let columnName in columns) {
    schemaObj[columnName] = columns[columnName].type ? columns[columnName].type : String
  }
  return schemaObj
}

module.exports.buildMongooseModel = (options, mongoose, knex) => {
  const {
    fromTable,
    columns,
    toCollection
  } = options
  let modelName = toCollection || fromTable
  if (mongoose.connection.models[modelName])
    delete mongoose.connection.models[modelName] // delete first model if exist

  let modelSchema = new mongoose.Schema(buildMongoSchemaObject(columns), {
    versionKey: false,
    collection: modelName
  });

  let callbacks = [] // add the callbacks for beforeSave
  for (columnName in columns) {
    if (columns[columnName].beforeSave instanceof Function) {
      callbacks.push(columns[columnName].beforeSave)
    }
  }

  modelSchema.post('validate', async function(doc) {
    for (let callaback of callbacks) {
      await callaback(doc, mongoose, knex)
    }
  })

  let model = mongoose.model(modelName, modelSchema)

  return model
}
