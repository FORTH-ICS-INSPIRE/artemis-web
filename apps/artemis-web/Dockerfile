FROM node:14.17.6-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .

RUN apk add --no-cache bash

RUN apk install libc6-compat

COPY ./apps/artemis-web/scripts/* ./

RUN yarn run nx build artemis-web --prod

ENTRYPOINT ["./entrypoint"]
