FROM node:boron
WORKDIR /opt
ADD ./docker-entrypoint.sh .
RUN chmod +x ./docker-entrypoint.sh
WORKDIR /opt/Service
EXPOSE 8000
ENTRYPOINT ../docker-entrypoint.sh
