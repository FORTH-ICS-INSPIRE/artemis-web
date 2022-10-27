FROM sitespeedio/node:ubuntu-20.04-nodejs-16.15.1

RUN apt-get update && apt-get install -y --no-install-recommends git python3 vim \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./

RUN npm i -g yarn

RUN yarn install  && yarn cache clean

COPY . .

COPY ./apps/artemis-web/scripts/* ./

RUN yarn run nx build artemis-web --prod

ENTRYPOINT ["./entrypoint"]
