FROM node

WORKDIR /app

COPY scripts/wait-for.sh scripts/wait.sh scripts/query.js ./
RUN chmod +x ./wait-for.sh

RUN npm install mongodb
RUN npm install argon2 nanoid
