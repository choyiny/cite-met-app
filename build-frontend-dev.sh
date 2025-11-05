#!/bin/bash

cd cite-met-app-frontend

git pull origin main
npm install
npm run build:dev

rm -rf ../public
mkdir -p ../public
cp -r dist/ ../public