const buildMongoSchemaObject = (columns) => {
  let schemaObj = {}
  for (let columnName in columns) {
    schemaObj[columnName] = columns[columnName].type ? columns[columnName].type : String
  }
  return schemaObj
}

module.exports.buildMongooseModel = (options, mongoose) => {
  const {
    fromTable,
    columns,
    toCollection
  } = options
  let modelName = toCollection || fromTable
  if (mongoose.connection.models[modelName])
    delete mongoose.connection.models[modelName] // delete first model if exist

  let modelSchema = new mongoose.Schema(buildMongoSchemaObject(columns), {
    versionKey: false
  });
  let model = mongoose.model(modelName, modelSchema)
  return model
}
