'use strict'

const fs = require('fs')
const path = require('path')
const mime = require('mime-types')
const { send, json } = require('micro')
const Filter = require('instagram_js_filter')
const effects = new Filter()

//
// This microservice will be served as /preview
//
// It will receive the name of the uploaded image and the filter in a JSON
// {
//   "name": "xxxx-xxx-xxx-xx.jpg",
//   "filter": "sepia"
// }
//
module.exports = async function (req, res) {
  const body = await json(req)
  const { name, filter } = body

  const type = mime.lookup(name)

  let preview
  try {
    preview = await convert(name, filter)
  } catch (e) {
    send(res, 500, e.message)
  }

  const imagePreview = `data:${type};base64,${preview.toString('base64')}`
  send(res, 200, { image: imagePreview })
}

//
// Convert an image and applies a filter
//
function convert (src, filter) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, 'uploads', src), (err, buffer) => {
      if (err) return reject(err)

      const result = effects.apply(buffer, filter, {})
      resolve(result)
    })
  })
}
