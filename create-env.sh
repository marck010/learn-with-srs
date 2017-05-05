#!/bin/bash

sudo docker build -t dictionary-database ./Database
sudo docker build -t dictionary-service ./Service
sudo docker build -t dictionary-front-end ./Front-end