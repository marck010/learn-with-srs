FROM node:boron
WORKDIR /opt
RUN git clone https://github.com/marck010/learn-with-srs.git
EXPOSE 8000
WORKDIR learn-with-srs/Service
ADD ./docker-entrypoint.sh .
RUN chmod +x ./docker-entrypoint.sh
CMD ./docker-entrypoint.sh
