FROM node:6.10.2-alpine

COPY . /src/app
WORKDIR /src/app

RUN npm install
RUN npm install -g micro

EXPOSE 3000

CMD [ "micro", "image-upload.js" ]
