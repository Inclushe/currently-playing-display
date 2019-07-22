const fs = require('fs')
const path = require('path')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

module.exports = (filePath) => {
  return new JSDOM(`<body><script>${fs.readFileSync(path.join(__dirname, filePath))}</script></body>`, { runScripts: 'dangerously', resources: 'usable' })
}
