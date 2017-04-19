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

  let image, result
  try {
    image = await convert(name, filter)
    result = await s3move(name, image)
  } catch (e) {
    console.log(e.stack)
    return send(res, 500, e.message)
  }

  send(res, 200, { name: name, src: result.Location })
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

//
// Saves an image to s3
//
function s3move (name, data) {
  return new Promise((resolve, reject) => {
    s3.upload({
      Key: `saved/${name}`,
      Body: data,
      ACL: 'public-read',
      ContentType: mime.lookup(name)
    }, (err, result) => {
      if (err) return reject(err)

      resolve(result)
    })
  })
}
