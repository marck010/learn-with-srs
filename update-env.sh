#!/bin/bash

sudo docker build -t dictionary-database ./Database
sudo docker build -t dictionary-service ./Service
sudo docker build -t dictionary-front-end ./Front-end

sudo docker run -d --name dictionary-database -p 27017:27017 dictionary-database   
sudo docker run -d --name dictionary-service -p 8000:8000 dictionary-service 
sudo docker run -d --name dictionary-front-end -p 8080:8080 dictionary-front-end 