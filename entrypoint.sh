#!/bin/sh -l
set -e

time=$(date)
echo "$time Run: npm install"
npm install

time=$(date)
echo "$time Run: npm run build --if-present"
npm run build --if-present
