FROM node:13

WORKDIR /app

ENV POST="8888"
ENV COIN_TYPE="0"
ENV VERSION_BYTE="0x00"

RUN npm install -g nodemon

COPY . /app

RUN npm install

ENTRYPOINT [ "node", "/app/src/index.js" ]
