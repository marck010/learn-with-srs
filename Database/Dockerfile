FROM mongo:latest
RUN apt-get update && apt-get install ssh -y && apt-get install sshpass -
RUN apt-get install git -y
WORKDIR /opt
ADD ./docker-entrypoint.sh .
RUN chmod +x ./docker-entrypoint.sh
RUN git clone https://github.com/marck010/learn-with-srs.git
EXPOSE 27017
ENTRYPOINT ./docker-entrypoint.sh
