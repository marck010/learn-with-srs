FROM node:boron
WORKDIR /opt
RUN git clone https://github.com/marck010/learn-with-srs.git
WORKDIR learn-with-srs/Front-end
EXPOSE 8080
CMD ["/bin/bash","-c","git pull && npm install && http-server -p 8080"]
