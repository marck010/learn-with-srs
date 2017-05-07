FROM node:boron
WORKDIR /opt
ADD ./docker-entrypoint.sh .
RUN chmod +x ./docker-entrypoint.sh
RUN git clone https://github.com/marck010/learn-with-srs.git
EXPOSE 8000
ENTRYPOINT ./docker-entrypoint.sh
