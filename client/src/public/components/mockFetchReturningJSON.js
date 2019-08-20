module.exports = function (object, status) {
  return new Promise((resolve, reject) => {
    resolve({
      status: status || 200,
      json () {
        return object
      }
    })
  })
}
