/**
 * Parses the query parameters from a URL and returns them as an object.
 *
 * @param {string} url
 * @returns {object} Object of key-value pairs.
 */
module.exports = function (url) {
  return Array.from(url.slice(url.indexOf('?') + 1).split('&')).reduce((object, pair, index) => {
    const key = pair.slice(0, pair.indexOf('='))
    const value = pair.slice(pair.indexOf('=') + 1, pair.length)
    object[key] = value
    return object
  }, {})
}
