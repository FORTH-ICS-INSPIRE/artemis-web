FROM node

WORKDIR /app

COPY scripts/wait-for.sh scripts/wait.sh scripts/query.js ./
RUN chmod +x ./wait-for.sh

RUN yarn install --frozen-lockfile

ARG DEFAULT_EMAIL
ARG DEFAULT_PASS
ARG MONGO_URI

ENTRYPOINT ./wait-for.sh -h mongodb -p 27017 -t 0 -- node query.js ${DEFAULT_EMAIL} ${DEFAULT_PASS} ${MONGO_URI} && yarn run build --prod
