FROM mongo:latest
RUN apt-get update && apt-get install ssh -y && apt-get install sshpass -
RUN apt-get install git -y
WORKDIR /opt
RUN git clone https://github.com/marck010/learn-with-srs.git
EXPOSE 27017
WORKDIR learn-with-srs/Database
ADD ./docker-entrypoint.sh .
RUN chmod +x ./docker-entrypoint.sh
ENTRYPOINT ./docker-entrypoint.sh
