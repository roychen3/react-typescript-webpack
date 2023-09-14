function isDev() {
  return process.env.NODE_ENV == 'development'
}

function getRootPath() {
  return process.cwd()
}

module.exports = { isDev, getRootPath }
