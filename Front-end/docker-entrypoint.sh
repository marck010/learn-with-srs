#!/bin/bash
cd learn-with-srs
git pull 
cd Front-end
npm install 
bower install --allow-root 
http-server -p 8080