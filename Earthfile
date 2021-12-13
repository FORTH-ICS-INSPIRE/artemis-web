VERSION 0.6

FROM node:14.17.6-bullseye-slim

WORKDIR /app

build:
    RUN apt-get update && apt-get install -y make gcc g++ git python3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

    COPY package.json yarn.lock ./

    RUN yarn install --frozen-lockfile && yarn cache clean

    COPY . .

    COPY ./apps/artemis-web/scripts/* ./

    RUN yarn build --prod

docker:
    ENTRYPOINT ["./entrypoint"]
    SAVE IMAGE curiouzk0d3r/artemis-frontend-web:arm64-latest
