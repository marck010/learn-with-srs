#!/bin/bash
export SERVER_DB=172.18.0.1:25017
cd learn-with-srs
git pull 
cd Service
npm install
bin/www 