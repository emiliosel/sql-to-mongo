export const buildSelect = (columns) => {
  let select = {}
  for (let columnName in columns) {
    if (!columns[columnName].embed) { // if the column is not from embeded content
      select[columnName] = columns[columnName].from ? columns[columnName].from : columnName
    }
  }
  return select
}
