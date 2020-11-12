#!/bin/sh

./wait-for.sh -h mongodb -p 27017 -t 0 -- node query.js $1 $2
