#!/bin/bash

# Buildar imagem do banco e recriar
sudo docker stop dictionary-database   
sudo docker rm dictionary-database   
sudo docker run -e "TZ=America/Sao_Paulo" --name dictionary-database -p 25017:27017 -v `pwd`/Database/data:/data/db -d mongo:latest


# # Buildar imagem do serviço e recriar
# sudo docker build -t dictionary-service ./Service
# sudo docker stop dictionary-service   
# sudo docker rm dictionary-service     
# sudo docker run -d --name dictionary-service -p 8000:8000 dictionary-service


# # Buildar imagem do frontend e recriar
# sudo docker build -t dictionary-front-end ./Front-end
# sudo docker stop dictionary-front-end   
# sudo docker rm dictionary-front-end   
# sudo docker run -d --name dictionary-front-end -p 8080:8080 dictionary-front-end 