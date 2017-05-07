#!/bin/bash
export SERVER_DB=172.18.0.1:25017
echo "Pasta atual:" `pwd`
git pull 
npm install
bin/www 