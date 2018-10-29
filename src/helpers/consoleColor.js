module.exports = function consoleColor(color) {
  let colors = {
    black: "\x1b[30m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    white: "\x1b[37m",
    cyan: "\x1b[36m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m"
  }
  return colors[color] ? colors[color] : colors
}
