FROM node:20.17.0

WORKDIR /app

COPY package.json .

RUN yarn install

ENTRYPOINT ["yarn", "start:dev"]