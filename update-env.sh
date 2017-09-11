#!/bin/bash

#Buildar imagem do serviço e recriar
sudo docker build -t dictionary-service ./Service
sudo docker stop dictionary-service   
sudo docker rm dictionary-service     
sudo docker run --name dictionary-service -p 8000:8000 -v `pwd`/Service/:/opt/Service -d dictionary-service 


#Buildar imagem do frontend e recriar
sudo docker build -t dictionary-front-end ./Front-end
sudo docker stop dictionary-front-end   
sudo docker rm dictionary-front-end   
sudo docker run --name dictionary-front-end -p 8080:8080 -v `pwd`/Front-end/:/opt/Front-end  -d dictionary-front-end  