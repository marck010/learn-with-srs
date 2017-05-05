FROM node:boron
WORKDIR /opt
RUN git clone https://github.com/marck010/learn-with-srs.git
WORKDIR learn-with-srs/Service
EXPOSE 8000
CMD ["/bin/bash","-c","npm install && bin/www"]
