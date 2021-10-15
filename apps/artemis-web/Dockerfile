FROM node:12.22.0-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

RUN apk add --no-cache bash

COPY . .
COPY ./apps/artemis-web/scripts/* ./

RUN yarn run nx build artemis-web --prod

ENTRYPOINT ["./entrypoint"]
