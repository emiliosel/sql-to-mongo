module.exports.buildSelect = (columns) => {
  let select = {}
  for (let columnName in columns) {
    if (!columns[columnName].embed && columns[columnName].type && !columns[columnName].type.custom) { // if the column is not from embeded content and not custom
      select[columnName] = columns[columnName].from ? columns[columnName].from : columnName
    }
  }
  return select
}
