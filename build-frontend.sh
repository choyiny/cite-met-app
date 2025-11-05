#!/bin/bash

cd cite-met-app-frontend

git pull origin main
npm install
npm run build

rm -rf ../public
mkdir -p ../public
cp -r dist/ ../public