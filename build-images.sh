#!/bin/bash

docker build upload -t micro-upload
docker build preview -t micro-preview
docker build save -t micro-save
docker build nginx -t micro-nginx
