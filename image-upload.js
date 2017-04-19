'use strict'

const path = require('path')
const isImage = require('is-image')
const uuid = require('uuid')
const { send } = require('micro')
const { upload, move } = require('micro-upload')

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

  // src: file object, dst: path
  await move(file, path.join(__dirname, 'uploads', name))

  send(res, 200, { name: name, src: `/uploads/${name}` })
})
