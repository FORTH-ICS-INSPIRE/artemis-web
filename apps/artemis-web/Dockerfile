FROM node:12.19.0-alpine

WORKDIR /app

COPY . .
COPY ./apps/artemis-web/scripts/* ./

RUN yarn install --frozen-lockfile && \
    yarn run nx build artemis-web --prod

RUN apk add --no-cache bash

ENTRYPOINT ["./entrypoint"]
