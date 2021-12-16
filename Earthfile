VERSION 0.6

FROM node:14.17.6-bullseye-slim

WORKDIR /app

build:
    RUN apt-get update && apt-get install -y make gcc g++ git python3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
    
    COPY package.json ./

    RUN set http_proxy=
    RUN set https_proxy=
    RUN yarn config delete proxy
    RUN yarn config set registry "https://registry.npmjs.org"

    RUN yarn install  --network-timeout 100000 && yarn cache clean

    COPY . .

    COPY ./apps/artemis-web/scripts/* ./

    RUN yarn build --prod


run:
  ENTRYPOINT ["./entrypoint"]

release:
    SAVE IMAGE --push curiouzk0d3r/artemis-frontend-web:arm64-latest
    
