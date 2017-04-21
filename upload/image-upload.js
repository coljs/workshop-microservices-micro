'use strict'

const path = require('path')
const isImage = require('is-image')
const uuid = require('uuid')
const mime = require('mime-types')
const S3 = require('aws-sdk/clients/s3')
const { send } = require('micro')
const { upload } = require('micro-upload')

const s3 = new S3({
  region: 'us-west-2',
  params: { Bucket: 'medellinjs-microservicios' },
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
})

//
// This microservice will be served as /upload
//
// It will receive an image using the form field name `file`
//
module.exports = upload(async (req, res) => {
  if (req.method.toLowerCase() !== 'post') {
    return send(res, 405, { error: 'invalid method, please use POST' })
  }

  if (!req.files) {
    return send(res, 400, { error: 'no file uploaded' })
  }

  let file = req.files.file
  if (!isImage(file.name)) {
    return send(res, 400, { error: 'we only accept images' })
  }

  let ext = path.extname(file.name)
  let name = uuid.v4() + ext

  const result = await s3move(name, file.data)

  send(res, 200, { name: name, src: result.Location })
})

function s3move (name, data) {
  return new Promise((resolve, reject) => {
    s3.upload({
      Key: `uploads/${name}`,
      Body: data,
      ACL: 'public-read',
      ContentType: mime.lookup(name)
    }, (err, data) => {
      if (err) return reject(err)

      resolve(data)
    })
  })
}
