#!/bin/bash

./wait-for.sh -h mongodb -p 27017 -t 0 -- node query.js
yarn run start --prod
