FROM node:14.17.6-bullseye-slim

RUN apt update && apt install -y make gcc g++ git python3 \
    && apt-get clean \ 
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json ./

RUN yarn install --frozen-lockfile && yarn cache clean

COPY . .

COPY ./apps/artemis-web/scripts/* ./

RUN yarn build --prod --verbose

ENTRYPOINT ["./entrypoint"]
