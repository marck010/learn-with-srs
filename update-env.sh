#!/bin/bash

sudo docker run -d --name dictionary-database dictionary-database   
sudo docker run -d --name dictionary-service dictionary-service 
sudo docker run -d --name dictionary-front-end dictionary-front-end 