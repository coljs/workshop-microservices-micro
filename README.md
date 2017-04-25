# microservices-demo

A microservices demo using Zeit's [micro](https://github.com/zeit/micro)

## Install

First we will need to install micro in our Node installation as a global package

```
$ npm install -g micro
```

## Run a microservice

```
$ micro name-of-microservice.js
```

## Testing with curl

### Upload an image

```
$ curl -F "file=@./image.jpg" http://localhost:3000/
```

### Preview & Save

```
$ curl -X POST -d "{\"image\": \"xxxxxx-xxxx-xxxx-xxxx-xxxxxx.jpg\", \"filter\": \"sepia\"}" http://localhost:3000/
```

## Docker

### Build Images

```
$ docker build upload -t micro-upload
$ docker build preview -t micro-preview
$ docker build save -t micro-save
$ docker build nginx -t micro-nginx
```

or run

```
$ ./build-images.sh
```

## Run with `docker-compose`

```
$ docker-compose up -d
```
