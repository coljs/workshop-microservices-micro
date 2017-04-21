'use strict'

const mime = require('mime-types')
const S3 = require('aws-sdk/clients/s3')
const { send, json } = require('micro')
const Filter = require('instagram_js_filter')
const effects = new Filter()

const s3 = new S3({
  region: 'us-west-2',
  params: { Bucket: 'medellinjs-microservicios' },
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

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
function convert (name, filter) {
  return new Promise((resolve, reject) => {
    s3.getObject({
      Key: `uploads/${name}`
    }, (err, result) => {
      if (err) return reject(err)

      const image = effects.apply(result.Body, filter, {})

      resolve(new Buffer(image, 'base64'))
    })
  })
}
