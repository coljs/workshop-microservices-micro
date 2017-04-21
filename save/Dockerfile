FROM node:6.10.2-alpine

COPY . /src/app
WORKDIR /src/app

RUN apk add --no-cache \
    build-base \
    g++ \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev
RUN npm install
RUN npm install -g micro

EXPOSE 3000

CMD [ "micro", "image-save.js" ]
