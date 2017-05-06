FROM node:boron
WORKDIR /opt
RUN git clone https://github.com/marck010/learn-with-srs.git
RUN npm install http-server -g
RUN npm install bower -g
WORKDIR learn-with-srs/Front-end
EXPOSE 8080
CMD git pull && npm install && bower install --allow-root && http-server -p 8080
