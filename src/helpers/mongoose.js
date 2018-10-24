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
  let modelSchema = new mongoose.Schema(buildSchemaObject(columns));
  let model = mongoose.model(modelName, modelSchema)
  return model
}
