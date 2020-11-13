FROM node:14

WORKDIR /app

COPY scripts/wait-for.sh scripts/query.js scripts/entrypoint.sh .env ./
COPY . .
RUN chmod +x ./entrypoint.sh

RUN yarn install --frozen-lockfile
RUN yarn build --prod

ENTRYPOINT ./entrypoint.sh
