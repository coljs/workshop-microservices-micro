'use strict'

const fs = require('fs')
const path = require('path')
const { send, json } = require('micro')
const Filter = require('instagram_js_filter')
const effects = new Filter()

//
// This microservice will be served as /save
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

  let image
  try {
    image = await convert(name, filter)
    await save(name, image)
  } catch (e) {
    return send(res, 500, e.message)
  }

  send(res, 200, { name: name, src: `/saved/${name}` })
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

//
// Saves an image to the file system
//
function save (name, image) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, 'saved', name), new Buffer(image, 'base64'), (err) => {
      if (err) return reject(err)

      resolve()
    })
  })
}
