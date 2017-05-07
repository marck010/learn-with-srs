FROM node:boron
WORKDIR /opt
ADD ./docker-entrypoint.sh .
RUN chmod +x ./docker-entrypoint.sh
RUN git clone https://github.com/marck010/learn-with-srs.git
RUN npm install http-server -g
RUN npm install bower -g
EXPOSE 8080
ENTRYPOINT ./docker-entrypoint.sh
