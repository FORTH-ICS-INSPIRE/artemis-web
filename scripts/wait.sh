#!/bin/sh

/scripts/wait-for.sh -h mongodb -p 27017 -- /scripts/entry.sh