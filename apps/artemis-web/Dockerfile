FROM node:14.17.6-bullseye-slim

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .

COPY ./apps/artemis-web/scripts/* ./

RUN yarn run nx build artemis-web --prod

ENTRYPOINT ["./entrypoint"]
